package main

import (
	"flag"
	"fmt"
	"io"

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
