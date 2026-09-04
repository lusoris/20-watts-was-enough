package main

import (
	"context"
	"flag"
	"fmt"
	"io"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/pdfrender"
)

func runPublicationVerifyPDFReproducibility(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("publication verify-pdf-reproducibility", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	sourceRef := flags.String("ref", "main", "book source ref")
	sourceRevision := flags.String("revision", "", "exact lowercase 40-character book source commit")
	receiptPath := flags.String("receipt", "", "new repository-relative JSON receipt path")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 || *receiptPath == "" {
		return 2
	}
	if err := pdfrender.ValidateSourceRevision(*sourceRef, *sourceRevision); err != nil {
		fmt.Fprintf(stderr, "publication verify-pdf-reproducibility: %v\n", err)
		return 2
	}
	receipt, err := pdfrender.VerifyReproducibility(context.Background(), pdfrender.ReproducibilityOptions{
		RepositoryRoot: *root,
		SourceRef:      *sourceRef,
		SourceRevision: *sourceRevision,
		ReceiptPath:    *receiptPath,
	})
	if err != nil {
		fmt.Fprintf(stderr, "Verify PDF renderer reproducibility: %v\n", err)
		return 1
	}
	fmt.Fprintf(
		stdout,
		"PDF renderer reproducibility passed for %s: %s, %s, complete PDF/manifest pair %s; receipt %s.\n",
		*sourceRef,
		receipt.Builds[0].ImageID,
		receipt.Builds[0].ManifestDigest,
		receipt.Builds[0].Pair.PairSHA256,
		*receiptPath,
	)
	return 0
}
