//go:build !aix && !darwin && !dragonfly && !freebsd && !linux && !netbsd && !openbsd && !solaris

package clrsfixture

import (
	"errors"
	"os/exec"
)

func configurePromiseProcess(_ *exec.Cmd) (func() error, error) {
	return nil, errors.New("Promise execution needs Unix process-group cleanup; receipt checking remains portable")
}
