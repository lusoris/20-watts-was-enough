package pdfrender

import (
	"archive/tar"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"strings"
)

const (
	maximumImageProofArchiveBytes int64 = 2 * 1024 * 1024 * 1024
	maximumImageProofEntries            = 128
	maximumImageProofBlobBytes    int64 = 64 * 1024
	maximumImageProofSmallBytes   int64 = 1024 * 1024
	imageProofTarBlockBytes             = 512
)

type imageProofArchive struct {
	small       map[string][]byte
	sizes       map[string]int64
	streamBytes int64
}

// imageProofStream bounds physical bytes, including padding and terminators.
// Its owner must close a blocking subprocess pipe when the context expires.
type imageProofStream struct {
	ctx       context.Context
	source    io.Reader
	remaining int64
	readBytes int64
}

func (stream *imageProofStream) Read(body []byte) (int, error) {
	if err := stream.ctx.Err(); err != nil {
		return 0, err
	}
	if stream.remaining < 0 {
		return 0, errors.New("image proof archive exceeds its byte bound")
	}
	if int64(len(body)) > stream.remaining+1 {
		body = body[:stream.remaining+1]
	}
	count, err := stream.source.Read(body)
	stream.remaining -= int64(count)
	stream.readBytes += int64(count)
	if stream.remaining < 0 {
		return count, errors.New("image proof archive exceeds its byte bound")
	}
	if contextError := stream.ctx.Err(); contextError != nil {
		return count, contextError
	}
	if count == 0 && err == nil && len(body) > 0 {
		return 0, io.ErrNoProgress
	}
	return count, err
}

func readImageProofArchive(ctx context.Context, source io.Reader) (result imageProofArchive, returnError error) {
	result.small = make(map[string][]byte)
	result.sizes = make(map[string]int64)
	stream := &imageProofStream{ctx: ctx, source: source, remaining: maximumImageProofArchiveBytes}
	defer func() { result.streamBytes = stream.readBytes }()
	seen := make(map[string]struct{}, maximumImageProofEntries)
	buffer := make([]byte, maximumImageProofBlobBytes)
	var retainedBytes int64
	for {
		var block [imageProofTarBlockBytes]byte
		if _, err := io.ReadFull(stream, block[:]); err != nil {
			return result, fmt.Errorf("read image proof archive header: %w", err)
		}
		if block == [imageProofTarBlockBytes]byte{} {
			return result, finishImageProofArchive(stream)
		}
		if len(seen) >= maximumImageProofEntries {
			return result, errors.New("image proof archive exceeds 128 physical headers")
		}
		header, err := decodeImageProofHeader(block[:])
		if err != nil {
			return result, err
		}
		if _, duplicate := seen[header.Name]; duplicate {
			return result, errors.New("image proof archive contains a duplicate name")
		}
		seen[header.Name] = struct{}{}
		if header.Typeflag == tar.TypeDir {
			continue
		}
		result.sizes[header.Name] = header.Size
		if header.Size <= maximumImageProofBlobBytes {
			if retainedBytes+header.Size > maximumImageProofSmallBytes {
				return result, errors.New("image proof archive exceeds 1 MiB of retained small blobs")
			}
			body := make([]byte, int(header.Size))
			if _, err := io.ReadFull(stream, body); err != nil {
				return result, fmt.Errorf("read image proof small blob: %w", err)
			}
			if isImageProofBlobName(header.Name) && header.Name != "blobs/sha256/"+strings.TrimPrefix(digestBytes(body), "sha256:") {
				return result, errors.New("image proof small blob does not hash to its name")
			}
			result.small[header.Name] = body
			retainedBytes += header.Size
		} else if written, err := io.CopyBuffer(io.Discard, io.LimitReader(stream, header.Size), buffer); err != nil || written != header.Size {
			return result, fmt.Errorf("read image proof large blob: %w", errors.Join(err, io.ErrUnexpectedEOF))
		}
		padding := (imageProofTarBlockBytes - header.Size%imageProofTarBlockBytes) % imageProofTarBlockBytes
		if _, err := io.ReadFull(stream, block[:padding]); err != nil {
			return result, fmt.Errorf("read image proof member padding: %w", err)
		}
		if !imageProofZeroBytes(block[:padding]) {
			return result, errors.New("image proof archive contains nonzero member padding")
		}
	}
}

func decodeImageProofHeader(block []byte) (*tar.Header, error) {
	// Reject extension headers before archive/tar can consume or hide them.
	// Decoding one allowed physical header needs no member or padding bytes.
	if len(block) != imageProofTarBlockBytes {
		return nil, errors.New("image proof archive header is not one complete block")
	}
	if block[156] != tar.TypeReg && block[156] != tar.TypeRegA && block[156] != tar.TypeDir {
		return nil, errors.New("image proof archive contains an unsupported physical header type")
	}
	header, err := tar.NewReader(bytes.NewReader(block)).Next()
	if err != nil {
		return nil, fmt.Errorf("decode image proof archive header: %w", err)
	}
	if header.Size < 0 || header.Size > maximumImageProofArchiveBytes || header.Linkname != "" {
		return nil, errors.New("image proof archive header has an unsupported size or link")
	}
	if header.Typeflag == tar.TypeDir {
		if header.Size != 0 || (header.Name != "blobs/" && header.Name != "blobs/sha256/") {
			return nil, errors.New("image proof archive contains an unsupported directory")
		}
		return header, nil
	}
	if header.Typeflag != tar.TypeReg || (!isImageProofBlobName(header.Name) &&
		header.Name != "index.json" && header.Name != "manifest.json" && header.Name != "oci-layout") {
		return nil, errors.New("image proof archive contains an unsupported member name or type")
	}
	return header, nil
}

func isImageProofBlobName(name string) bool {
	digest, present := strings.CutPrefix(name, "blobs/sha256/")
	if !present || len(digest) != 64 {
		return false
	}
	for _, value := range digest {
		if !((value >= '0' && value <= '9') || (value >= 'a' && value <= 'f')) {
			return false
		}
	}
	return true
}

func imageProofZeroBytes(body []byte) bool {
	for _, value := range body {
		if value != 0 {
			return false
		}
	}
	return true
}

// The caller consumed the first zero block. A second complete zero block is
// mandatory, followed only by zero padding in complete 512-byte blocks.
func finishImageProofArchive(stream io.Reader) error {
	var block [imageProofTarBlockBytes]byte
	if _, err := io.ReadFull(stream, block[:]); err != nil {
		return fmt.Errorf("read image proof second terminator block: %w", err)
	}
	if block != [imageProofTarBlockBytes]byte{} {
		return errors.New("image proof second terminator block is nonzero")
	}
	for {
		count, err := io.ReadFull(stream, block[:])
		if count == 0 && errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return fmt.Errorf("read image proof aligned trailing padding: %w", err)
		}
		if block != [imageProofTarBlockBytes]byte{} {
			return errors.New("image proof archive contains nonzero trailing data")
		}
	}
}
