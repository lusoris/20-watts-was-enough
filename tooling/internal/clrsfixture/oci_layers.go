package clrsfixture

import (
	"compress/gzip"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
	"os"
)

func inspectGeneratorOCILayer(ctx context.Context, file *os.File, member generatorOCIMember, descriptor GeneratorOCIDescriptor, expectedDiffID string, remaining int64) (GeneratorOCILayer, error) {
	var result GeneratorOCILayer
	if remaining < 0 {
		return result, errors.New("OCI decoded layer streams exceed their byte boundary")
	}
	raw := &io.LimitedReader{R: generatorOCIReader{ctx, io.NewSectionReader(file, member.offset, member.size)}, N: member.size}
	rawHash, expandedHash := sha256.New(), sha256.New()
	var stream io.Reader = io.TeeReader(raw, rawHash)
	var compressed *gzip.Reader
	if descriptor.MediaType == generatorOCITarType+"+gzip" {
		var err error
		compressed, err = gzip.NewReader(stream)
		if err != nil {
			return result, err
		}
		// The default multistream mode checks every gzip member through EOF;
		// concatenated members count towards the same decoded-byte boundary.
		stream = compressed
	} else if descriptor.MediaType != generatorOCITarType {
		return result, errors.New("OCI layer encoding is outside the candidate profile")
	}
	n, err := io.Copy(expandedHash, io.LimitReader(generatorOCIReader{ctx, stream}, remaining+1))
	if compressed != nil {
		err = errors.Join(err, compressed.Close())
	}
	if err != nil || n > remaining {
		return result, errors.Join(err, errors.New("OCI layer decoding failed or exceeded its aggregate byte boundary"))
	}
	diffID := "sha256:" + hex.EncodeToString(expandedHash.Sum(nil))
	if raw.N != 0 || "sha256:"+hex.EncodeToString(rawHash.Sum(nil)) != descriptor.Digest || diffID != expectedDiffID {
		return result, errors.New("OCI layer section or ordered decoded diff ID differs from its descriptor/config")
	}
	return GeneratorOCILayer{descriptor, diffID, n}, ctx.Err()
}
