package workstationrunner

import "testing"

func TestSameCanonicalPathUsesWindowsCaseFoldingOnly(t *testing.T) {
	t.Parallel()
	left := `C:\Users\Research\Repository`
	right := `c:\users\research\repository`
	if !sameCanonicalPathForOS("windows", left, right) {
		t.Fatal("Windows case variant was not treated as the same canonical path")
	}
	if sameCanonicalPathForOS("linux", left, right) {
		t.Fatal("non-Windows path comparison unexpectedly ignored case")
	}
	if sameCanonicalPathForOS("windows", left, `C:\Users\Research\Other`) {
		t.Fatal("Windows comparison accepted a different canonical path")
	}
}
