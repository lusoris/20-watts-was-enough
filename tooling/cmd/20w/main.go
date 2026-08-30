// Command 20w runs repository validation and experiment tools.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/buildinfo"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/docscheck"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/experiment"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githublabels"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/nodeimage"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/releaseimage"
)

var githubOutputPrefixPattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,31}$`)

type repeatedString []string

func (values *repeatedString) String() string { return strings.Join(*values, ",") }

func (values *repeatedString) Set(value string) error {
	*values = append(*values, value)
	return nil
}

func usage(writer io.Writer) {
	fmt.Fprintln(writer, "Usage:")
	fmt.Fprintln(writer, "  20w validate docs [--root <repository>]")
	fmt.Fprintln(writer, "  20w experiment list [--root <repository>] [--json]")
	fmt.Fprintln(writer, "  20w experiment validate [--root <repository>]")
	fmt.Fprintln(writer, "  20w experiment release-plan [--root <repository>] [--json]")
	fmt.Fprintln(writer, "  20w experiment package-node-image --artifact <id> --output <directory> [--root <repository>]")
	fmt.Fprintln(writer, "  20w github sync-labels [--root <repository>] [--check | --repository <owner/name>]")
	fmt.Fprintln(writer, "  20w release inspect-image --image <registry path> --tag <vX.Y.Z> --revision <commit> --platform <os/arch> --expected-label <key=value>")
	fmt.Fprintln(writer, "  20w version [--json]")
}

func run(arguments []string, stdout, stderr io.Writer) int {
	if len(arguments) == 0 || arguments[0] == "help" || arguments[0] == "--help" || arguments[0] == "-h" {
		usage(stdout)
		return 0
	}
	switch arguments[0] {
	case "validate":
		if len(arguments) >= 2 && arguments[1] == "docs" {
			return runValidateDocs(arguments[2:], stdout, stderr)
		}
	case "experiment":
		if len(arguments) >= 2 && arguments[1] == "list" {
			return runExperimentList(arguments[2:], stdout, stderr)
		}
		if len(arguments) >= 2 && arguments[1] == "validate" {
			return runExperimentValidate(arguments[2:], stdout, stderr)
		}
		if len(arguments) >= 2 && arguments[1] == "package-node-image" {
			return runPackageNodeImage(arguments[2:], stdout, stderr)
		}
		if len(arguments) >= 2 && arguments[1] == "release-plan" {
			return runExperimentReleasePlan(arguments[2:], stdout, stderr)
		}
	case "release":
		if len(arguments) >= 2 && arguments[1] == "inspect-image" {
			return runReleaseInspectImage(arguments[2:], stdout, stderr)
		}
	case "github":
		if len(arguments) >= 2 && arguments[1] == "sync-labels" {
			return runGitHubSyncLabels(arguments[2:], stdout, stderr)
		}
	case "version":
		return runVersion(arguments[1:], stdout, stderr)
	}
	fmt.Fprintf(stderr, "Unknown 20w command: %s\n", arguments[0])
	usage(stderr)
	return 2
}

func runGitHubSyncLabels(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("github sync-labels", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	repository := flags.String("repository", "", "GitHub owner/repository to synchronize")
	check := flags.Bool("check", false, "validate the local manifest without network access")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	manifest, err := githublabels.Load(*root)
	if err != nil {
		fmt.Fprintf(stderr, "Load GitHub label manifest: %v\n", err)
		return 1
	}
	if *check {
		if *repository != "" {
			fmt.Fprintln(stderr, "github sync-labels --check does not accept --repository")
			return 2
		}
		fmt.Fprintf(stdout, "GitHub label manifest validation passed: %d managed labels.\n", len(manifest.Labels))
		return 0
	}
	client := &http.Client{
		Timeout: 20 * time.Second,
		CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
			return errors.New("GitHub label API redirect refused")
		},
	}
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Minute)
	defer cancel()
	result, err := githublabels.Sync(ctx, client, manifest, githublabels.Options{
		Repository: *repository,
		Token:      os.Getenv("GH_TOKEN"),
	})
	if err != nil {
		fmt.Fprintf(stderr, "Synchronize GitHub labels: %v\n", err)
		return 1
	}
	fmt.Fprintf(
		stdout,
		"GitHub label synchronization passed: %d created, %d updated, %d unchanged.\n",
		result.Created,
		result.Updated,
		result.Unchanged,
	)
	return 0
}

func runReleaseInspectImage(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("release inspect-image", flag.ContinueOnError)
	flags.SetOutput(stderr)
	image := flags.String("image", "", "lowercase registry image path without a tag")
	tag := flags.String("tag", "", "exact vMAJOR.MINOR.PATCH tag")
	digest := flags.String("digest", "", "immutable sha256 image digest")
	revision := flags.String("revision", "", "lowercase 40-character source commit")
	jsonOutput := flags.Bool("json", false, "write the inspection result as JSON")
	requireExisting := flags.Bool("require-existing", false, "reject a repeatedly confirmed absent exact reference")
	githubPrefix := flags.String("github-output-prefix", "", "write prefixed GitHub step-output records")
	var platforms repeatedString
	var labelValues repeatedString
	flags.Var(&platforms, "platform", "expected operating-system/architecture; repeat for each platform")
	flags.Var(&labelValues, "expected-label", "required image config label as key=value; repeat for each label")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	labels, err := expectedLabels(labelValues)
	if err != nil || (*tag == "") == (*digest == "") || (*githubPrefix != "" && !githubOutputPrefixPattern.MatchString(*githubPrefix)) || (*jsonOutput && *githubPrefix != "") {
		fmt.Fprintln(stderr, "release inspect-image received an invalid reference, label, output prefix, or output-mode combination")
		return 2
	}
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	inspect := releaseimage.Inspect
	if *requireExisting {
		inspect = releaseimage.InspectExisting
	}
	result, err := inspect(ctx, releaseimage.Options{
		Image:          *image,
		Tag:            *tag,
		Digest:         *digest,
		Revision:       *revision,
		Platforms:      platforms,
		ExpectedLabels: labels,
		Username:       os.Getenv("GHCR_USERNAME"),
		Token:          os.Getenv("GHCR_TOKEN"),
	})
	if err != nil {
		fmt.Fprintf(stderr, "Inspect exact release image: %v\n", err)
		return 1
	}
	if *githubPrefix != "" {
		writeGitHubImageOutputs(stdout, *githubPrefix, result)
		return 0
	}
	if *jsonOutput {
		if err := json.NewEncoder(stdout).Encode(result); err != nil {
			fmt.Fprintf(stderr, "Write release image inspection: %v\n", err)
			return 1
		}
		return 0
	}
	fmt.Fprintf(stdout, "Release image %s is %s", result.Reference, result.Status)
	if result.Digest != "" {
		fmt.Fprintf(stdout, " at %s for %s", result.Digest, strings.Join(result.Platforms, ", "))
	}
	fmt.Fprintln(stdout, ".")
	return 0
}

func writeGitHubImageOutputs(writer io.Writer, prefix string, result releaseimage.Result) {
	publish := result.Status == "absent"
	fmt.Fprintf(writer, "%s_status=%s\n%s_publish=%t\n%s_digest=%s\n", prefix, result.Status, prefix, publish, prefix, result.Digest)
}

func expectedLabels(values []string) (map[string]string, error) {
	labels := make(map[string]string, len(values))
	for _, value := range values {
		parts := strings.SplitN(value, "=", 2)
		if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
			return nil, fmt.Errorf("expected label %q must have the form key=value", value)
		}
		if _, exists := labels[parts[0]]; exists {
			return nil, fmt.Errorf("expected label %q is repeated", parts[0])
		}
		labels[parts[0]] = parts[1]
	}
	return labels, nil
}

func runPackageNodeImage(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("experiment package-node-image", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	artifact := flags.String("artifact", "", "supported experiment artifact")
	output := flags.String("output", "", "new Docker build-context directory")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	if *artifact == "" || *output == "" {
		fmt.Fprintln(stderr, "experiment package-node-image requires --artifact and --output")
		return 2
	}
	if err := nodeimage.Package(nodeimage.Options{
		RepositoryRoot: *root,
		OutputRoot:     *output,
		Artifact:       *artifact,
	}); err != nil {
		fmt.Fprintf(stderr, "Package Node experiment image: %v\n", err)
		return 1
	}
	fmt.Fprintf(stdout, "Packaged %s experiment image context at %s.\n", *artifact, *output)
	return 0
}

func runValidateDocs(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("validate docs", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	if err := flags.Parse(arguments); err != nil {
		return 2
	}
	if flags.NArg() != 0 {
		fmt.Fprintln(stderr, "validate docs accepts only --root <repository>")
		return 2
	}

	result := docscheck.Validate(*root)
	for _, warning := range result.Warnings {
		fmt.Fprintf(stderr, "Documentation warning: %s\n", warning)
	}
	if len(result.Errors) != 0 {
		fmt.Fprintf(stderr, "Documentation validation failed with %d error(s):\n", len(result.Errors))
		for _, validationError := range result.Errors {
			fmt.Fprintf(stderr, "- %s\n", validationError)
		}
		return 1
	}

	fmt.Fprintf(
		stdout,
		"Documentation validation passed: %d Markdown files, %d chapters, %d Mermaid sources.\n",
		result.MarkdownFiles,
		result.Chapters,
		result.MermaidFiles,
	)
	return 0
}

func runExperimentList(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("experiment list", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	jsonOutput := flags.Bool("json", false, "write the catalogue as JSON")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	catalog, err := experiment.LoadCatalog(*root)
	if err != nil {
		fmt.Fprintf(stderr, "Load experiment catalogue: %v\n", err)
		return 1
	}
	if *jsonOutput {
		encoder := json.NewEncoder(stdout)
		encoder.SetIndent("", "  ")
		if err := encoder.Encode(catalog); err != nil {
			fmt.Fprintf(stderr, "Write experiment catalogue: %v\n", err)
			return 1
		}
		return 0
	}
	for _, entry := range catalog {
		fmt.Fprintf(stdout, "%s\t%s\t%s\n", entry.Artifact, entry.Readiness, entry.Distribution.State)
	}
	return 0
}

func runExperimentValidate(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("experiment validate", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	catalog, err := experiment.LoadCatalog(*root)
	if err != nil {
		fmt.Fprintf(stderr, "Validate experiment catalogue: %v\n", err)
		return 1
	}
	plan, err := experiment.LoadReleasePlan(*root)
	if err != nil {
		fmt.Fprintf(stderr, "Validate experiment release plan: %v\n", err)
		return 1
	}
	fmt.Fprintf(stdout, "Experiment catalogue validation passed: %d manifests, %d release images.\n", len(catalog), len(plan))
	return 0
}

func runExperimentReleasePlan(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("experiment release-plan", flag.ContinueOnError)
	flags.SetOutput(stderr)
	root := flags.String("root", ".", "repository root")
	jsonOutput := flags.Bool("json", false, "write the plan as JSON")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	plan, err := experiment.LoadReleasePlan(*root)
	if err != nil {
		fmt.Fprintf(stderr, "Load experiment release plan: %v\n", err)
		return 1
	}
	if *jsonOutput {
		encoder := json.NewEncoder(stdout)
		encoder.SetIndent("", "  ")
		if err := encoder.Encode(plan); err != nil {
			fmt.Fprintf(stderr, "Write experiment release plan: %v\n", err)
			return 1
		}
		return 0
	}
	for _, entry := range plan {
		fmt.Fprintf(stdout, "%s\t%s\t%s\n", entry.Artifact, entry.Distribution.Image, strings.Join(entry.Distribution.Platforms, ","))
	}
	return 0
}

func runVersion(arguments []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("version", flag.ContinueOnError)
	flags.SetOutput(stderr)
	jsonOutput := flags.Bool("json", false, "write build identity as JSON")
	if err := flags.Parse(arguments); err != nil || flags.NArg() != 0 {
		return 2
	}
	info := buildinfo.Current()
	if *jsonOutput {
		if err := json.NewEncoder(stdout).Encode(info); err != nil {
			fmt.Fprintf(stderr, "Write build identity: %v\n", err)
			return 1
		}
		return 0
	}
	fmt.Fprintf(stdout, "20w %s (%s, %s/%s, %s)\n", info.Version, info.Revision, info.OperatingSys, info.Architecture, info.GoVersion)
	return 0
}

func main() {
	os.Exit(run(os.Args[1:], os.Stdout, os.Stderr))
}
