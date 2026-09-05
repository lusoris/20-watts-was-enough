package pdfrender

import (
	"os/exec"
	"syscall"
)

func configureImageProofProcess(command *exec.Cmd) error {
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	return nil
}

func killImageProofProcess(command *exec.Cmd) error {
	return syscall.Kill(-command.Process.Pid, syscall.SIGKILL)
}
