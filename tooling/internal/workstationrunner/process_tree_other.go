//go:build !aix && !darwin && !dragonfly && !freebsd && !linux && !netbsd && !openbsd && !solaris && !windows

package workstationrunner

import (
	"fmt"
	"os/exec"
	"runtime"
)

func configureProcessTree(*exec.Cmd) (processTree, error) {
	return nil, fmt.Errorf("bounded process-tree cancellation is unavailable on %s", runtime.GOOS)
}
