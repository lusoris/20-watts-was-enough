package experimentcli

import (
	"bytes"
	"testing"
)

func TestCLRSContextCLIRequiresAllExplicitInputs(t *testing.T) {
	for _, args := range [][]string{nil, {"--check"}, {"--output", "candidate.tar"}, {"--unknown"}, {"extra"}} {
		var stdout, stderr bytes.Buffer
		if code := runCommand(t, append([]string{"materialize-clrs-context"}, args...), &stdout, &stderr); code != 2 || stdout.Len() != 0 {
			t.Fatalf("args %v: code %d, stdout %q", args, code, stdout.String())
		}
	}
}
