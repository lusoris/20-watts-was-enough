//go:build !linux

package pdfrender

import (
	"errors"
	"os/exec"
)

func configureImageProofProcess(_ *exec.Cmd) error {
	return errors.New("renderer image proof requires Linux process-group cancellation")
}

func killImageProofProcess(command *exec.Cmd) error { return command.Process.Kill() }
