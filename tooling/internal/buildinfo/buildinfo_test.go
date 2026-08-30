package buildinfo

import "testing"

func TestCurrentIncludesRuntimeIdentity(t *testing.T) {
	t.Parallel()
	info := Current()
	if info.Version == "" || info.Revision == "" || info.GoVersion == "" || info.OperatingSys == "" || info.Architecture == "" {
		t.Fatalf("Current() returned an incomplete identity: %+v", info)
	}
}
