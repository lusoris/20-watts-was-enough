package publictransport

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func validTestManifest() Manifest {
	return Manifest{
		Schema:                          1,
		HTTPURL:                         "http://www.cordana.dev/",
		HTTPSURL:                        "https://www.cordana.dev/",
		HTTPStatus:                      301,
		HTTPSStatus:                     200,
		RedirectLocation:                "https://www.cordana.dev/",
		Server:                          "cloudflare",
		RequiredHeader:                  "CF-Ray",
		TimeoutSeconds:                  15,
		MinimumCertificateRemainingDays: 14,
	}
}

func writeManifest(t *testing.T, root string, body []byte) string {
	t.Helper()
	directory := filepath.Join(root, ".github")
	if err := os.MkdirAll(directory, 0o755); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(directory, "public-transport.json")
	if err := os.WriteFile(path, body, 0o644); err != nil {
		t.Fatal(err)
	}
	return path
}

func writeValidManifest(t *testing.T, root string, manifest Manifest) {
	t.Helper()
	body, err := json.Marshal(manifest)
	if err != nil {
		t.Fatal(err)
	}
	writeManifest(t, root, body)
}

func TestLoadAcceptsClosedManifest(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	want := validTestManifest()
	writeValidManifest(t, root, want)
	got, err := Load(root)
	if err != nil {
		t.Fatal(err)
	}
	if got != want {
		t.Fatalf("Load() = %#v, want %#v", got, want)
	}
}

func TestLoadRejectsAmbiguousJSON(t *testing.T) {
	t.Parallel()
	validBody, err := json.Marshal(validTestManifest())
	if err != nil {
		t.Fatal(err)
	}
	cases := map[string]string{
		"duplicate": strings.Replace(string(validBody), `"schema":1`, `"schema":1,"schema":1`, 1),
		"unknown":   strings.TrimSuffix(string(validBody), "}") + `,"extra":true}`,
		"trailing":  string(validBody) + `{}`,
		"malformed": `{"schema":1`,
	}
	for name, body := range cases {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			writeManifest(t, root, []byte(body))
			if _, err := Load(root); err == nil {
				t.Fatalf("Load() accepted %s JSON", name)
			}
		})
	}
}

func TestLoadRejectsCaseFoldedAndAliasKeys(t *testing.T) {
	t.Parallel()
	validBody, err := json.Marshal(validTestManifest())
	if err != nil {
		t.Fatal(err)
	}
	cases := map[string]string{
		"capitalized schema": strings.Replace(string(validBody), `"schema":`, `"Schema":`, 1),
		"uppercase URL":      strings.Replace(string(validBody), `"http_url":`, `"HTTP_URL":`, 1),
		"camel alias": strings.Replace(
			string(validBody),
			`"minimum_certificate_remaining_days":`,
			`"Minimum_Certificate_Remaining_Days":`,
			1,
		),
		"extra folded alias": strings.TrimSuffix(string(validBody), "}") + `,"HTTP_URL":"http://www.cordana.dev/"}`,
	}
	for name, body := range cases {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			writeManifest(t, root, []byte(body))
			if _, err := Load(root); err == nil || !strings.Contains(err.Error(), "unexpected exact key") {
				t.Fatalf("Load() error = %v, want exact-key refusal", err)
			}
		})
	}
}

func TestLoadRejectsInvalidManifestValues(t *testing.T) {
	t.Parallel()
	cases := map[string]func(*Manifest){
		"schema":      func(value *Manifest) { value.Schema = 2 },
		"http scheme": func(value *Manifest) { value.HTTPURL = "https://www.cordana.dev/" },
		"different host": func(value *Manifest) {
			value.HTTPSURL = "https://cordana.dev/"
			value.RedirectLocation = value.HTTPSURL
		},
		"credentials":       func(value *Manifest) { value.HTTPURL = "http://user@www.cordana.dev/" },
		"query":             func(value *Manifest) { value.HTTPSURL += "?source=test"; value.RedirectLocation = value.HTTPSURL },
		"fragment":          func(value *Manifest) { value.HTTPSURL += "#top"; value.RedirectLocation = value.HTTPSURL },
		"redirect":          func(value *Manifest) { value.RedirectLocation = "https://www.cordana.dev/other" },
		"http status":       func(value *Manifest) { value.HTTPStatus = 302 },
		"https status":      func(value *Manifest) { value.HTTPSStatus = 204 },
		"server whitespace": func(value *Manifest) { value.Server = " cloudflare" },
		"server identity":   func(value *Manifest) { value.Server = "origin" },
		"header":            func(value *Manifest) { value.RequiredHeader = "X-Edge" },
		"timeout low":       func(value *Manifest) { value.TimeoutSeconds = 0 },
		"timeout high":      func(value *Manifest) { value.TimeoutSeconds = 31 },
		"days low":          func(value *Manifest) { value.MinimumCertificateRemainingDays = 13 },
		"days high":         func(value *Manifest) { value.MinimumCertificateRemainingDays = 91 },
	}
	for name, mutate := range cases {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			manifest := validTestManifest()
			mutate(&manifest)
			writeValidManifest(t, root, manifest)
			if _, err := Load(root); err == nil {
				t.Fatalf("Load() accepted invalid %s", name)
			}
		})
	}
}

func TestLoadPinsSchemaOneEndpoints(t *testing.T) {
	t.Parallel()
	cases := map[string]func(*Manifest){
		"loopback": func(value *Manifest) { value.HTTPURL = "http://127.0.0.1/" },
		"private":  func(value *Manifest) { value.HTTPURL = "http://10.0.0.1/" },
		"link local": func(value *Manifest) {
			value.HTTPSURL = "https://169.254.169.254/"
			value.RedirectLocation = value.HTTPSURL
		},
		"custom HTTP port": func(value *Manifest) { value.HTTPURL = "http://www.cordana.dev:8080/" },
		"custom HTTPS port": func(value *Manifest) {
			value.HTTPSURL = "https://www.cordana.dev:8443/"
			value.RedirectLocation = value.HTTPSURL
		},
		"non-root path": func(value *Manifest) {
			value.HTTPSURL = "https://www.cordana.dev/help/"
			value.RedirectLocation = value.HTTPSURL
		},
		"missing root slash": func(value *Manifest) {
			value.HTTPURL = "http://www.cordana.dev"
		},
		"host case alias": func(value *Manifest) { value.HTTPURL = "http://WWW.CORDANA.DEV/" },
	}
	for name, mutate := range cases {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			manifest := validTestManifest()
			mutate(&manifest)
			writeValidManifest(t, root, manifest)
			if _, err := Load(root); err == nil || !strings.Contains(err.Error(), "must exactly equal") {
				t.Fatalf("Load() error = %v, want canonical-endpoint refusal", err)
			}
		})
	}
}

func TestLoadRejectsSymlinkedManifest(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".github"), 0o755); err != nil {
		t.Fatal(err)
	}
	target := filepath.Join(t.TempDir(), "public-transport.json")
	body, err := json.Marshal(validTestManifest())
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(target, body, 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, filepath.Join(root, ".github", "public-transport.json")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := Load(root); err == nil || !strings.Contains(err.Error(), "regular file") {
		t.Fatalf("Load() error = %v, want regular-file refusal", err)
	}
}

func TestLoadRejectsOversizedManifest(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeManifest(t, root, []byte(strings.Repeat(" ", maximumManifestBytes+1)))
	if _, err := Load(root); err == nil || !strings.Contains(err.Error(), "exceeds") {
		t.Fatalf("Load() error = %v, want byte-bound refusal", err)
	}
}
