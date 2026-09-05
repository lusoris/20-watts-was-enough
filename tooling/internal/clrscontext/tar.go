package clrscontext

import (
	"archive/tar"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"path"
	"sort"
	"strings"
	"time"
)

type limitWriter struct {
	writer    io.Writer
	remaining int64
	written   int64
}

func (w *limitWriter) Write(body []byte) (int, error) {
	if int64(len(body)) > w.remaining {
		return 0, errors.New("CLRS context exceeds 2 GiB")
	}
	n, err := w.writer.Write(body)
	w.remaining -= int64(n)
	w.written += int64(n)
	return n, err
}

func writeContext(ctx context.Context, out io.Writer, p plan) (Result, error) {
	digest := sha256.New()
	bounded := &limitWriter{writer: io.MultiWriter(out, digest), remaining: maximumContextBytes}
	archive := tar.NewWriter(bounded)
	defer archive.Close()
	directories, err := contextDirectories(p.members)
	if err != nil {
		return Result{}, err
	}
	for _, name := range directories {
		if err := ctx.Err(); err != nil {
			return Result{}, err
		}
		if err := archive.WriteHeader(&tar.Header{Name: name + "/", Mode: 0o755, Typeflag: tar.TypeDir, ModTime: time.Unix(p.epoch, 0), Format: tar.FormatUSTAR}); err != nil {
			return Result{}, err
		}
	}
	for _, m := range p.members {
		if err := ctx.Err(); err != nil {
			return Result{}, err
		}
		// PAX permits exact wheel basenames longer than USTAR's 100-byte field.
		// Go still emits USTAR when it fits; otherwise only the path is extended.
		if err := archive.WriteHeader(&tar.Header{Name: m.Path, Mode: m.Mode, Size: m.SizeBytes, Typeflag: tar.TypeReg, ModTime: time.Unix(p.epoch, 0), Format: tar.FormatPAX}); err != nil {
			return Result{}, err
		}
		if err := copyMember(ctx, archive, m); err != nil {
			return Result{}, err
		}
	}
	if err := archive.Close(); err != nil {
		return Result{}, err
	}
	return Result{hex.EncodeToString(digest.Sum(nil)), bounded.written, len(p.members)}, nil
}

func contextDirectories(members []member) ([]string, error) {
	if len(members) == 0 || len(members) > 4096 {
		return nil, errors.New("CLRS context member count exceeds 1..4096")
	}
	names := make(map[string]bool, len(members))
	directories := map[string]bool{}
	for _, m := range members {
		if !validMemberPath(m.Path) || m.SizeBytes < 0 || m.SizeBytes > maximumContextBytes || (m.Mode != 0o644 && m.Mode != 0o755) {
			return nil, fmt.Errorf("invalid CLRS context member %q", m.Path)
		}
		if names[m.Path] {
			return nil, errors.New("duplicate CLRS context member")
		}
		names[m.Path] = true
		for parent := path.Dir(m.Path); parent != "."; parent = path.Dir(parent) {
			directories[parent] = true
		}
	}
	result := make([]string, 0, len(directories))
	for name := range directories {
		if names[name] {
			return nil, errors.New("CLRS context file conflicts with directory")
		}
		result = append(result, name)
	}
	sort.Strings(result)
	return result, nil
}

func validMemberPath(name string) bool {
	if name == "." || name == ".." || path.Clean(name) != name || strings.HasPrefix(name, "/") || strings.Contains(name, "../") || len(name) > 240 || strings.Count(name, "/") > 18 {
		return false
	}
	for _, value := range []byte(name) {
		if value < 33 || value > 126 || value == '\\' || value == ':' {
			return false
		}
	}
	return true
}

func checkContext(ctx context.Context, name string, p plan) (Result, error) {
	expected, err := writeContext(ctx, io.Discard, p)
	if err != nil {
		return Result{}, err
	}
	return verifyContextFile(ctx, name, expected)
}

func verifyContextFile(ctx context.Context, name string, expected Result) (Result, error) {
	file, before, err := openStable(name, expected.SizeBytes)
	if err != nil {
		return Result{}, err
	}
	defer file.Close()
	digest := sha256.New()
	n, err := io.Copy(digest, io.LimitReader(contextReader{ctx, file}, expected.SizeBytes+1))
	if err != nil {
		return Result{}, err
	}
	if n != expected.SizeBytes || hex.EncodeToString(digest.Sum(nil)) != expected.SHA256 {
		return Result{}, errors.New("CLRS context differs from exact candidate inputs")
	}
	if err := confirmFile(file, name, before); err != nil {
		return Result{}, err
	}
	return expected, nil
}
