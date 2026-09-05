package clrsfixture

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"strings"
	"testing"
)

func TestLoadedImageAbsenceNeverHidesAnotherCommandFailure(t *testing.T) {
	for _, mode := range []string{"arguments", "deadline", "cleanup", "exit-125", "stdout", "wrong-id", "stderr-prefix", "stdout-cap", "diagnostic-cap", "diagnostic-mismatch"} {
		t.Run(mode, func(t *testing.T) {
			options, fake := loadedImageTestFixture(t)
			fake.interlock = func(index int, _ []string, record *generationCommandEvidence) error {
				if index != 4 {
					return nil
				}
				switch mode {
				case "arguments":
					record.Arguments[1] = "--context"
				case "deadline":
					return context.DeadlineExceeded
				case "cleanup":
					return errors.New("process group cleanup failed")
				case "exit-125":
					record.ExitCode = 125
				case "stdout":
					record.Stdout = []byte("unrelated response\n")
				case "wrong-id":
					record.Stderr = []byte("Error response from daemon: No such image: " + fake.proof.Manifest.Digest + "\n")
				case "stderr-prefix":
					record.Stderr = append([]byte("permission denied\n"), record.Stderr...)
				case "stdout-cap":
					record.Stdout = bytes.Repeat([]byte(" "), 64<<10+1)
				case "diagnostic-cap":
					record.Error = strings.Repeat("x", 4097)
				case "diagnostic-mismatch":
					record.Error = "process cleanup failed"
				}
				return nil
			}
			report, err := prepareGeneratorLoadedImage(context.Background(), options, fake.execute, nil)
			assertLoadedImageFailure(t, report, err)
			if mode == "deadline" && !errors.Is(err, context.DeadlineExceeded) {
				t.Fatal("child deadline cause was lost")
			}
		})
	}
}

func TestLoadedImageInspectionRejectsReorderedDiffIDs(t *testing.T) {
	_, fake := loadedImageTestFixture(t)
	// This unit constructs an independent raw-metadata pair, not an OCI archive
	// acceptance fixture. The full-path tests separately use the OCI inspector.
	var config, manifest map[string]any
	if json.Unmarshal(fake.proof.ConfigBytes, &config) != nil || json.Unmarshal(fake.proof.ManifestBytes, &manifest) != nil {
		t.Fatal("decode synthetic metadata")
	}
	config["rootfs"].(map[string]any)["diff_ids"] = []string{"sha256:" + strings.Repeat("1", 64), "sha256:" + strings.Repeat("2", 64)}
	fake.proof.ConfigBytes = generationImageJSON(t, config)
	fake.proof.Config.Digest = "sha256:" + rawSHA256(fake.proof.ConfigBytes)
	fake.proof.Config.Bytes = int64(len(fake.proof.ConfigBytes))
	descriptor := manifest["config"].(map[string]any)
	descriptor["digest"], descriptor["size"] = fake.proof.Config.Digest, len(fake.proof.ConfigBytes)
	fake.proof.ManifestBytes = generationImageJSON(t, manifest)
	fake.proof.Manifest.Digest = "sha256:" + rawSHA256(fake.proof.ManifestBytes)
	fake.proof.Manifest.Bytes = int64(len(fake.proof.ManifestBytes))
	body := fake.inspection(fake.proof.Manifest.Digest)
	if _, err := bindLoadedImageInspection(body, fake.proof, fake.runtime); err != nil {
		t.Fatal(err)
	}
	var observed map[string]any
	if err := json.Unmarshal(body, &observed); err != nil {
		t.Fatal(err)
	}
	layers := observed["RootFS"].(map[string]any)["Layers"].([]any)
	layers[0], layers[1] = layers[1], layers[0]
	if _, err := bindLoadedImageInspection(generationImageJSON(t, observed), fake.proof, fake.runtime); err == nil {
		t.Fatal("reordered loaded rootfs diff IDs were accepted")
	}
}

func TestLoadedImageAbsenceRequiresOnlyNormalExitOne(t *testing.T) {
	digest := "sha256:" + strings.Repeat("a", 64)
	record := generationCommandEvidence{ExitCode: 1, Stderr: []byte("Error response from daemon: No such image: " + digest + "\n")}
	exit := loadedImageTestExit(t)
	if !loadedImageMissing(record, errors.Join(errors.Join(exit)), digest) {
		t.Fatal("ordinary joined exit-1 absence was rejected")
	}
	for _, err := range []error{nil, errors.New("exit status 1"), errors.Join(exit, context.Canceled), errors.Join(exit, io.ErrShortWrite)} {
		if loadedImageMissing(record, err, digest) {
			t.Fatalf("nonstandard cause counted as absence: %v", err)
		}
	}
	for index := 0; index < 20; index++ {
		exit = errors.Join(exit)
	}
	if loadedImageMissing(record, exit, digest) {
		t.Fatal("unbounded cause nesting was accepted")
	}
}

func TestLoadedImageRejectsChangedConsumedInspectionFields(t *testing.T) {
	mutations := map[string]func(map[string]any){
		"foreign-id": func(value map[string]any) { value["Id"] = "sha256:" + strings.Repeat("f", 64) },
		"alias":      func(value map[string]any) { value["id"] = value["Id"] },
		"null-os":    func(value map[string]any) { value["Os"] = nil },
		"platform":   func(value map[string]any) { value["Architecture"] = "arm64" },
		"config":     func(value map[string]any) { value["Config"].(map[string]any)["User"] = "0:0" },
		"null-scalar": func(value map[string]any) {
			value["Config"].(map[string]any)["Tty"] = nil
		},
		"environment": func(value map[string]any) { value["Config"].(map[string]any)["Env"] = []string{"HOME=/"} },
		"rootfs": func(value map[string]any) {
			value["RootFS"].(map[string]any)["Layers"] = []string{"sha256:" + strings.Repeat("f", 64)}
		},
	}
	for name, change := range mutations {
		t.Run(name, func(t *testing.T) {
			options, fake := loadedImageTestFixture(t)
			var value map[string]any
			if err := json.Unmarshal(fake.images[fake.proof.Manifest.Digest], &value); err != nil {
				t.Fatal(err)
			}
			change(value)
			fake.images[fake.proof.Manifest.Digest] = generationImageJSON(t, value)
			report, err := prepareGeneratorLoadedImage(context.Background(), options, fake.execute, nil)
			assertLoadedImageFailure(t, report, err)
		})
	}
	for _, mode := range []string{"duplicate", "trailing", "null-config"} {
		options, fake := loadedImageTestFixture(t)
		body := fake.images[fake.proof.Manifest.Digest]
		switch mode {
		case "duplicate":
			body = append([]byte(`{"Id":"duplicate",`), body[1:]...)
		case "trailing":
			body = append(body, []byte(`{}`)...)
		case "null-config":
			body = []byte(`{"Id":"` + fake.proof.Manifest.Digest + `","Os":"linux","Architecture":"amd64","Config":null,"RootFS":{}}`)
		}
		fake.images[fake.proof.Manifest.Digest] = body
		report, err := prepareGeneratorLoadedImage(context.Background(), options, fake.execute, nil)
		assertLoadedImageFailure(t, report, err)
	}
}

func TestLoadedImageReadOnlyCommandAllowlistAndBudget(t *testing.T) {
	_, fake := loadedImageTestFixture(t)
	observer := loadedImageObserver{execute: fake.execute}
	for _, args := range [][]string{{"image", "load"}, {"image", "pull", "alpine"}, {"container", "create"}, {"container", "run"},
		{"image", "tag"}, {"image", "rm"}, {"system", "prune"}, {"image", "inspect", "--format", "{{json .}}", "latest"},
		{"image", "inspect", "--format", "{{json .}}", fake.proof.Manifest.Digest, "extra"}} {
		if _, err := observer.command(context.Background(), args...); err == nil {
			t.Fatalf("disallowed arguments accepted: %v", args)
		}
	}
	if len(fake.calls) != 0 {
		t.Fatal("disallowed command reached the executor")
	}
	for index := 0; index < 4; index++ {
		if _, err := observer.command(context.Background(), "version", "--format", "{{.Client.Version}} {{.Server.Version}}"); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := observer.command(context.Background(), "info", "--format", "{{json .}}"); err == nil || len(fake.calls) != 4 {
		t.Fatal("a fifth Docker call was possible")
	}
}
