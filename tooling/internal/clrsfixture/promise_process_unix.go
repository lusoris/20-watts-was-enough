//go:build aix || darwin || dragonfly || freebsd || linux || netbsd || openbsd || solaris

package clrsfixture

import (
	"errors"
	"os"
	"os/exec"
	"syscall"
)

func configurePromiseProcess(command *exec.Cmd) (func() error, error) {
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	cleanup := func() error {
		if command.Process == nil {
			return nil
		}
		err := syscall.Kill(-command.Process.Pid, syscall.SIGKILL)
		if errors.Is(err, syscall.ESRCH) || errors.Is(err, os.ErrProcessDone) {
			return nil
		}
		return err
	}
	command.Cancel = cleanup
	return cleanup, nil
}
