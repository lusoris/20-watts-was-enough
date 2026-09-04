package pdftools

import (
	"archive/tar"
	"bufio"
	"compress/gzip"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"path"
	"path/filepath"
	"strings"
)

const (
	maximumLayerEntries   = 200_000
	maximumLayerPathBytes = 64 * 1024 * 1024
	maximumLayerPathLinks = 64
)

type layerFilesystemEntry struct {
	typeflag byte
	linkname string
}

type layerInspection struct {
	Notices        []NoticeObservation
	ForbiddenPaths []string
	ManPages       []string
}

// NoticeObservation records one byte-exact notice retained by the final layer.
type NoticeObservation struct {
	Path      string `json:"path"`
	SHA256    string `json:"sha256"`
	SizeBytes int64  `json:"size_bytes"`
	Mode      string `json:"mode"`
	UID       int    `json:"uid"`
	GID       int    `json:"gid"`
}

func inspectFinalLayers(ctx context.Context, image inspectedFinalImage, contract Contract) (layerInspection, error) {
	if len(image.Manifest.Layers) != 2 || len(image.Config.RootFS.DiffIDs) != 2 {
		return layerInspection{}, errors.New("final image does not expose exactly two inspectable layers")
	}
	base, err := inspectBaseLayer(ctx, image.Layout, image.Manifest.Layers[0], image.Config.RootFS.DiffIDs[0], contract)
	if err != nil {
		return layerInspection{}, err
	}
	notices, err := inspectNoticeLayer(ctx, image.Layout, image.Manifest.Layers[1], image.Config.RootFS.DiffIDs[1], contract)
	if err != nil {
		return layerInspection{}, err
	}
	base.Notices = notices
	return base, nil
}

func inspectBaseLayer(ctx context.Context, layout string, descriptor ociDescriptor, diffID string, contract Contract) (layerInspection, error) {
	wantedManPages := make(map[string]bool, len(contract.Runtime.ManPages))
	for _, name := range contract.Runtime.ManPages {
		wantedManPages["usr/share/man/man1/"+name] = false
	}
	forbidden := make(map[string]bool, len(contract.Runtime.ForbiddenPaths))
	for _, name := range contract.Runtime.ForbiddenPaths {
		forbidden[strings.TrimPrefix(name, "/")] = false
	}
	filesystem := make(map[string]layerFilesystemEntry)
	directories := make(map[string]struct{})
	var pathBytes int64
	_, err := scanCompressedLayer(ctx, layout, descriptor, diffID, contract, func(header *tar.Header, reader io.Reader) error {
		name, err := cleanLayerPath(header.Name)
		if err != nil {
			return err
		}
		if _, duplicate := filesystem[name]; duplicate {
			return fmt.Errorf("base layer repeats path %s", name)
		}
		if len(header.Linkname) > 4_096 || strings.ContainsAny(header.Linkname, "\\\x00") {
			return fmt.Errorf("base layer path %s has an invalid link target", name)
		}
		pathBytes += int64(len(name) + len(header.Linkname))
		if pathBytes > maximumLayerPathBytes {
			return errors.New("base layer paths exceed their aggregate byte boundary")
		}
		filesystem[name] = layerFilesystemEntry{typeflag: header.Typeflag, linkname: header.Linkname}
		if header.Typeflag == tar.TypeDir {
			directories[name] = struct{}{}
		}
		for ancestor := path.Dir(name); ancestor != "." && ancestor != "/"; ancestor = path.Dir(ancestor) {
			directories[ancestor] = struct{}{}
		}
		if _, exists := wantedManPages[name]; exists {
			if header.Typeflag != tar.TypeReg || header.Size <= 0 {
				return fmt.Errorf("Poppler man page %s is not a regular retained file", name)
			}
			wantedManPages[name] = true
		}
		return nil
	})
	if err != nil {
		return layerInspection{}, err
	}
	for name := range forbidden {
		exists, err := layerPathExists(filesystem, directories, name)
		if err != nil {
			return layerInspection{}, fmt.Errorf("resolve forbidden base path %s: %w", name, err)
		}
		forbidden[name] = exists
	}
	result := layerInspection{}
	for _, name := range contract.Runtime.ForbiddenPaths {
		if forbidden[strings.TrimPrefix(name, "/")] {
			result.ForbiddenPaths = append(result.ForbiddenPaths, name)
		}
	}
	if len(result.ForbiddenPaths) != 0 {
		return layerInspection{}, fmt.Errorf("base image contains forbidden paths: %s", strings.Join(result.ForbiddenPaths, ", "))
	}
	for _, name := range contract.Runtime.ManPages {
		if !wantedManPages["usr/share/man/man1/"+name] {
			return layerInspection{}, fmt.Errorf("base image omits Poppler man page %s", name)
		}
		result.ManPages = append(result.ManPages, name)
	}
	return result, nil
}

func layerPathExists(
	filesystem map[string]layerFilesystemEntry,
	directories map[string]struct{},
	target string,
) (bool, error) {
	cleaned, err := cleanLayerPath(strings.TrimPrefix(target, "/"))
	if err != nil {
		return false, err
	}
	components := strings.Split(cleaned, "/")
	links := 0
	for {
		for index := range components {
			candidate := path.Join(components[:index+1]...)
			entry, present := filesystem[candidate]
			last := index == len(components)-1
			if last {
				_, directory := directories[candidate]
				return present || directory, nil
			}
			if present && (entry.typeflag == tar.TypeSymlink || entry.typeflag == tar.TypeLink) {
				links++
				if links > maximumLayerPathLinks {
					return false, errors.New("base layer link resolution exceeds its hop boundary")
				}
				linked := entry.linkname
				if linked == "" {
					return false, errors.New("base layer link target is empty")
				}
				if entry.typeflag == tar.TypeSymlink && !path.IsAbs(linked) {
					linked = path.Join(path.Dir(candidate), linked)
				} else {
					linked = strings.TrimPrefix(linked, "/")
				}
				remaining := strings.Join(components[index+1:], "/")
				linked = path.Clean(path.Join(linked, remaining))
				if linked == "." || linked == ".." || strings.HasPrefix(linked, "../") || path.IsAbs(linked) {
					return false, errors.New("base layer link target escapes its filesystem root")
				}
				components = strings.Split(linked, "/")
				break
			}
			if present && entry.typeflag != tar.TypeDir {
				return false, nil
			}
			if _, directory := directories[candidate]; !present && !directory {
				return false, nil
			}
			if index == len(components)-1 {
				return true, nil
			}
		}
	}
}

func inspectNoticeLayer(ctx context.Context, layout string, descriptor ociDescriptor, diffID string, contract Contract) ([]NoticeObservation, error) {
	wanted := make(map[string]NoticeEntry, len(contract.NoticeLayer.Entries))
	for _, entry := range contract.NoticeLayer.Entries {
		wanted[strings.TrimPrefix(entry.Destination, "/")] = entry
	}
	observed := make(map[string]NoticeObservation, len(wanted))
	directories := make(map[string]struct{}, 4)
	var total int64
	_, err := scanCompressedLayer(ctx, layout, descriptor, diffID, contract, func(header *tar.Header, reader io.Reader) error {
		name, err := cleanLayerPath(header.Name)
		if err != nil {
			return err
		}
		entry, expected := wanted[name]
		if header.Typeflag == tar.TypeDir {
			if !noticeAncestor(name) || header.Size != 0 || header.Mode != 0o755 || header.Uid != 0 ||
				header.Gid != 0 || header.Linkname != "" ||
				!hasExactReproductionTarMetadata(header, contract.SourceDateEpoch) {
				return fmt.Errorf("notice layer contains unrelated directory %s", name)
			}
			if _, duplicate := directories[name]; duplicate {
				return fmt.Errorf("notice layer repeats directory %s", name)
			}
			directories[name] = struct{}{}
			return nil
		}
		if !expected || header.Typeflag != tar.TypeReg || header.Uid != 0 || header.Gid != 0 ||
			header.Mode != 0o644 || header.Size != entry.Size || header.Linkname != "" ||
			!hasExactReproductionTarMetadata(header, contract.SourceDateEpoch) {
			return fmt.Errorf("notice layer entry %s differs from its exact file contract", name)
		}
		if _, duplicate := observed[name]; duplicate {
			return fmt.Errorf("notice layer repeats %s", name)
		}
		hasher := sha256.New()
		written, err := io.CopyN(hasher, reader, header.Size)
		if err != nil || written != header.Size || hex.EncodeToString(hasher.Sum(nil)) != entry.SHA256 {
			return fmt.Errorf("notice layer bytes for %s differ from the committed source", name)
		}
		total += written
		if total > contract.Limits.NoticeBytes {
			return errors.New("notice layer bytes exceed their aggregate boundary")
		}
		observed[name] = NoticeObservation{
			Path: "/" + name, SHA256: entry.SHA256, SizeBytes: entry.Size,
			Mode: "0644", UID: header.Uid, GID: header.Gid,
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	if len(observed) != len(wanted) {
		return nil, errors.New("notice layer omits one or more exact Poppler notice files")
	}
	if len(directories) != 4 {
		return nil, errors.New("notice layer omits one or more exact ancestor directories")
	}
	result := make([]NoticeObservation, 0, len(contract.NoticeLayer.Entries))
	for _, entry := range contract.NoticeLayer.Entries {
		result = append(result, observed[strings.TrimPrefix(entry.Destination, "/")])
	}
	return result, nil
}

func scanCompressedLayer(
	ctx context.Context,
	layout string,
	descriptor ociDescriptor,
	diffID string,
	contract Contract,
	visit func(*tar.Header, io.Reader) error,
) (int64, error) {
	filePath := filepath.Join(layout, "blobs", "sha256", strings.TrimPrefix(descriptor.Digest, "sha256:"))
	file, err := openBoundedRegular(filePath, contract.Limits.FinalArchiveBytes, "compressed OCI layer")
	if err != nil {
		return 0, err
	}
	defer file.Close()
	compressedHasher := sha256.New()
	compressedCounting := &countingReader{source: file}
	compressedSource := io.TeeReader(compressedCounting, compressedHasher)
	bufferedCompressed := bufio.NewReaderSize(compressedSource, 128*1024)
	gzipReader, err := gzip.NewReader(bufferedCompressed)
	if err != nil {
		return 0, fmt.Errorf("open compressed OCI layer: %w", err)
	}
	defer gzipReader.Close()
	gzipReader.Multistream(false)
	expandedMaximum := 8 * contract.Limits.FinalArchiveBytes
	uncompressedHasher := sha256.New()
	boundedUncompressed := io.LimitReader(gzipReader, expandedMaximum+1)
	counting := &countingReader{source: io.TeeReader(boundedUncompressed, uncompressedHasher)}
	tarReader := tar.NewReader(counting)
	entries := 0
	for {
		if err := ctx.Err(); err != nil {
			return counting.count, err
		}
		header, err := tarReader.Next()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			if counting.count > expandedMaximum {
				return counting.count, errors.New("OCI layer exceeds its expanded-byte boundary")
			}
			return counting.count, fmt.Errorf("read OCI layer tar: %w", err)
		}
		entries++
		if entries > maximumLayerEntries || counting.count > expandedMaximum {
			return counting.count, errors.New("OCI layer exceeds its entry or expanded-byte boundary")
		}
		if err := visit(header, tarReader); err != nil {
			return counting.count, err
		}
	}
	if err := drainZeroLayerPadding(ctx, counting, expandedMaximum-counting.count); err != nil {
		return counting.count, err
	}
	if counting.count > expandedMaximum ||
		"sha256:"+hex.EncodeToString(uncompressedHasher.Sum(nil)) != diffID {
		return counting.count, errors.New("expanded OCI layer differs from its config diff ID")
	}
	if err := gzipReader.Close(); err != nil {
		return counting.count, fmt.Errorf("close compressed OCI layer: %w", err)
	}
	if err := drainZeroLayerPadding(ctx, bufferedCompressed, contract.Limits.FinalArchiveBytes-compressedCounting.count); err != nil {
		return counting.count, errors.New("compressed OCI layer contains a second gzip member or non-zero trailing payload")
	}
	if compressedCounting.count != descriptor.Size ||
		"sha256:"+hex.EncodeToString(compressedHasher.Sum(nil)) != descriptor.Digest {
		return counting.count, errors.New("compressed OCI layer differs from its manifest digest")
	}
	if err := verifyOpenedRegular(filePath, file, compressedCounting.count, "compressed OCI layer"); err != nil {
		return counting.count, err
	}
	return counting.count, nil
}

func drainZeroLayerPadding(ctx context.Context, reader io.Reader, maximum int64) error {
	if maximum < 0 {
		return errors.New("OCI layer padding exceeds its byte boundary")
	}
	buffer := make([]byte, 128*1024)
	var read int64
	for {
		if err := ctx.Err(); err != nil {
			return err
		}
		count, err := reader.Read(buffer)
		if count > 0 {
			read += int64(count)
			if read > maximum {
				return errors.New("OCI layer padding exceeds its byte boundary")
			}
			if !allZero(buffer[:count]) {
				return errors.New("OCI layer contains non-zero trailing payload")
			}
		}
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return fmt.Errorf("read OCI layer padding: %w", err)
		}
	}
}

func cleanLayerPath(value string) (string, error) {
	if value == "" || len(value) > 4_096 || strings.Contains(value, "\\") ||
		strings.ContainsRune(value, '\x00') || path.IsAbs(value) {
		return "", errors.New("OCI layer contains an invalid path")
	}
	cleaned := path.Clean(value)
	if cleaned == "." || cleaned == ".." || strings.HasPrefix(cleaned, "../") || cleaned != strings.TrimSuffix(value, "/") {
		return "", fmt.Errorf("OCI layer path %q is not canonical", value)
	}
	return cleaned, nil
}

func noticeAncestor(value string) bool {
	return value == "usr" || value == "usr/share" || value == "usr/share/licenses" || value == "usr/share/licenses/poppler"
}
