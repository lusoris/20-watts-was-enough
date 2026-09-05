//go:build aix || darwin || dragonfly || freebsd || linux || netbsd || openbsd || solaris

package workstationrunner

import (
	"errors"
	"os"
	"os/exec"
	"syscall"
)

type unixProcessTree struct {
	command *exec.Cmd
}

func configureProcessTree(command *exec.Cmd) (processTree, error) {
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	tree := &unixProcessTree{command: command}
	command.Cancel = func() error {
		err := tree.terminate()
		if errors.Is(err, syscall.ESRCH) {
			return os.ErrProcessDone
		}
		return err
	}
	return tree, nil
}

func (*unixProcessTree) attach() error { return nil }

func (tree *unixProcessTree) cleanup() error {
	if err := tree.terminate(); err != nil && !errors.Is(err, syscall.ESRCH) && !errors.Is(err, os.ErrProcessDone) {
		return err
	}
	return nil
}

func (tree *unixProcessTree) terminate() error {
	if tree.command.Process == nil {
		return os.ErrProcessDone
	}
	return syscall.Kill(-tree.command.Process.Pid, syscall.SIGKILL)
}
