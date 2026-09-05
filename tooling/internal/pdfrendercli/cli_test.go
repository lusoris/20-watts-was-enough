package pdfrendercli

import (
	"bytes"
	"context"
	"errors"
	"reflect"
	"strings"
	"testing"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/pdfrender"
)

func TestProofPreservesOptionsAndSuccessBytes(t *testing.T) {
	for _, sourceRef := range []string{"main", "v1.2.3"} {
		want := pdfrender.ReproducibilityOptions{RepositoryRoot: "chosen-root", SourceRef: sourceRef, SourceRevision: strings.Repeat("a", 40), ReceiptPath: "build/evidence/proof.json"}
		calls := 0
		verify := func(_ context.Context, got pdfrender.ReproducibilityOptions) (pdfrender.ReproducibilityReceipt, error) {
			calls++
			if !reflect.DeepEqual(got, want) {
				t.Fatalf("options=%#v, want %#v", got, want)
			}
			return proofReceipt(), nil
		}
		var stdout, stderr bytes.Buffer
		code := runVerifyReproducibility([]string{"--root", want.RepositoryRoot, "--ref", want.SourceRef, "--revision", want.SourceRevision, "--receipt", want.ReceiptPath}, &stdout, &stderr, verify)
		output := "PDF renderer reproducibility passed for " + sourceRef + ": image-id, manifest-id, complete PDF/manifest pair pair-id; receipt build/evidence/proof.json.\n"
		if code != 0 || calls != 1 || stderr.Len() != 0 || stdout.String() != output {
			t.Fatalf("exit=%d calls=%d stdout=%q stderr=%q", code, calls, stdout.String(), stderr.String())
		}
	}
}

func TestProofPreservesDefaultMainOptions(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code := runVerifyReproducibility([]string{"--receipt", "proof.json"}, &stdout, &stderr, func(_ context.Context, got pdfrender.ReproducibilityOptions) (pdfrender.ReproducibilityReceipt, error) {
		want := pdfrender.ReproducibilityOptions{RepositoryRoot: ".", SourceRef: "main", ReceiptPath: "proof.json"}
		if !reflect.DeepEqual(got, want) {
			t.Fatalf("options=%#v, want %#v", got, want)
		}
		return proofReceipt(), nil
	})
	if code != 0 || stderr.Len() != 0 {
		t.Fatalf("exit=%d stderr=%q", code, stderr.String())
	}
}

func TestProofRejectsArgumentsBeforeVerification(t *testing.T) {
	for _, args := range [][]string{
		nil, {"--ref", "main"}, {"--receipt"}, {"--unknown"}, {"--help"},
		{"--receipt", "proof.json", "extra"},
		{"--receipt", "proof.json", "--ref", "release/latest"},
		{"--receipt", "proof.json", "--ref", "v1.2.3"},
		{"--receipt", "proof.json", "--ref", "v1.2.3", "--revision", strings.Repeat("A", 40)},
	} {
		var stdout, stderr bytes.Buffer
		code := runVerifyReproducibility(args, &stdout, &stderr, func(context.Context, pdfrender.ReproducibilityOptions) (pdfrender.ReproducibilityReceipt, error) {
			t.Fatal("invalid arguments reached the verifier")
			return pdfrender.ReproducibilityReceipt{}, nil
		})
		if code != 2 || stdout.Len() != 0 {
			t.Fatalf("args=%q exit=%d stdout=%q stderr=%q", args, code, stdout.String(), stderr.String())
		}
	}
}

func TestProofPropagatesOperationalFailureWithoutSuccess(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code := runVerifyReproducibility([]string{"--receipt", "proof.json"}, &stdout, &stderr, func(context.Context, pdfrender.ReproducibilityOptions) (pdfrender.ReproducibilityReceipt, error) {
		return pdfrender.ReproducibilityReceipt{}, errors.New("retained proof mismatch")
	})
	if code != 1 || stdout.Len() != 0 || stderr.String() != "Verify PDF renderer reproducibility: retained proof mismatch\n" {
		t.Fatalf("exit=%d stdout=%q stderr=%q", code, stdout.String(), stderr.String())
	}
}

func TestProofOutputErrorAndShortWriteFail(t *testing.T) {
	for _, short := range []bool{false, true} {
		var stderr bytes.Buffer
		code := runVerifyReproducibility([]string{"--receipt", "proof.json"}, failingWriter{short}, &stderr, func(context.Context, pdfrender.ReproducibilityOptions) (pdfrender.ReproducibilityReceipt, error) {
			return proofReceipt(), nil
		})
		if code != 1 || !strings.Contains(stderr.String(), "Write PDF renderer reproducibility result:") {
			t.Fatalf("short=%t exit=%d stderr=%q", short, code, stderr.String())
		}
	}
}

func TestPublicAdapterRejectsInvalidRootBeforeDocker(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code := RunVerifyReproducibility([]string{"--root", t.TempDir(), "--receipt", "proof.json"}, &stdout, &stderr)
	if code != 1 || stdout.Len() != 0 || !strings.Contains(stderr.String(), "Verify PDF renderer reproducibility:") {
		t.Fatalf("exit=%d stdout=%q stderr=%q", code, stdout.String(), stderr.String())
	}
}

func proofReceipt() pdfrender.ReproducibilityReceipt {
	return pdfrender.ReproducibilityReceipt{Builds: []pdfrender.ReproducibilityBuild{{ImageID: "image-id", ManifestDigest: "manifest-id", Pair: pdfrender.ReproducibilityPair{PairSHA256: "pair-id"}}}}
}

type failingWriter struct{ short bool }

func (writer failingWriter) Write(body []byte) (int, error) {
	if writer.short {
		return len(body) - 1, nil
	}
	return 0, errors.New("writer rejected output")
}
