package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"os"
	"os/signal"
	"syscall"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/pdftools"
)

func runPublicationVerifyPDFTools(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("publication verify-pdf-tools", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	result, err := pdftools.Check(*root)
	if err != nil {
		fmt.Fprintf(stderr, "Verify PDF-tools image authority: %v\n", err)
		return 1
	}
	fmt.Fprintf(
		stdout,
		"PDF-tools authority passed: %d locked APKs, %d Poppler notices, %d declared APK bytes; lock %s.\n",
		result.Packages,
		result.Notices,
		result.RetainedBytes,
		result.LockSHA256,
	)
	return 0
}

func runPublicationReproducePDFToolsImage(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("publication reproduce-pdf-tools-image", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	receipt := flags.String("receipt", "", "new repository-relative NO_RESULT receipt")
	finalArchive := flags.String("final-archive", "", "new repository-relative final OCI archive")
	spdx := flags.String("spdx", "", "new repository-relative exact apko SPDX")
	sourceBundle := flags.String("source-bundle", "", "new repository-relative checksum-closed source bundle")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 || *receipt == "" {
		if *receipt == "" {
			fmt.Fprintln(stderr, "publication reproduce-pdf-tools-image requires --receipt <new.json>")
		}
		return 2
	}
	candidatePaths := []string{*finalArchive, *spdx, *sourceBundle}
	candidateCount := 0
	for _, path := range candidatePaths {
		if path != "" {
			candidateCount++
		}
	}
	var candidate *pdftools.CandidateOutputOptions
	if candidateCount != 0 && candidateCount != len(candidatePaths) {
		fmt.Fprintln(stderr, "publication reproduce-pdf-tools-image requires all of --final-archive, --spdx and --source-bundle")
		return 2
	}
	if candidateCount == len(candidatePaths) {
		candidate = &pdftools.CandidateOutputOptions{
			FinalArchivePath: *finalArchive, SPDXPath: *spdx, SourceBundlePath: *sourceBundle,
		}
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	result, err := pdftools.ReproduceFinalImage(ctx, pdftools.ReproductionOptions{
		RepositoryRoot: *root,
		ReceiptPath:    *receipt,
		Candidate:      candidate,
	})
	if err != nil {
		fmt.Fprintf(stderr, "Reproduce local PDF-tools final image: %v\n", err)
		return 1
	}
	fmt.Fprintf(
		stdout,
		"Local PDF-tools construction passed under %s; final manifest %s; retained %s.\n",
		result.Authority,
		result.FinalBuilds[0].Manifest,
		*receipt,
	)
	if result.Candidate != nil {
		fmt.Fprintf(
			stdout,
			"Candidate inputs prepared without publication: %s, %s and %s.\n",
			result.Candidate.FinalArchive.Path,
			result.Candidate.SPDX.Path,
			result.Candidate.SourceBundle.Path,
		)
	}
	return 0
}
