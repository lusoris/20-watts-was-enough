package workstationrunner

import (
	"path/filepath"
	"runtime"
	"strings"
)

func sameCanonicalPath(left, right string) bool {
	return sameCanonicalPathForOS(runtime.GOOS, left, right)
}

func sameCanonicalPathForOS(goos, left, right string) bool {
	left = filepath.Clean(left)
	right = filepath.Clean(right)
	if goos == "windows" {
		return strings.EqualFold(left, right)
	}
	return left == right
}
