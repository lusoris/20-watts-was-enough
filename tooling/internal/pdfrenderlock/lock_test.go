package pdfrenderlock

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestParseAcceptsTheTrackedRendererAuthorityAndRejectsDrift(t *testing.T) {
	t.Parallel()
	body, err := os.ReadFile(filepath.Join("..", "..", "..", filepath.FromSlash(RelativePath)))
	if err != nil {
		t.Fatal(err)
	}
	lock, err := Parse(body)
	if err != nil {
		t.Fatal(err)
	}
	if lock.Schema != 3 || lock.Platform != "linux/amd64" || !lock.Exporter.RewriteTimestamp {
		t.Fatalf("Parse() lock = %+v", lock)
	}
	for name, candidate := range map[string][]byte{
		"duplicate": []byte(strings.Replace(string(body), `"schema": 3`, `"schema": 3, "schema": 3`, 1)),
		"unknown":   []byte(strings.Replace(string(body), "{", `{"unknown": true,`, 1)),
		"trailing":  append(append([]byte(nil), body...), []byte("{}\n")...),
		"oversized": bytes.Repeat([]byte{' '}, int(MaximumBytes)+1),
	} {
		if _, err := Parse(candidate); err == nil {
			t.Fatalf("Parse() accepted %s authority drift", name)
		}
	}
	lock.Builder.BuildKitImage = "docker.io/moby/buildkit:latest"
	if err := Validate(lock); err == nil {
		t.Fatal("Validate() accepted a mutable BuildKit image")
	}
}
