package clrsfixture

import (
	"context"
	"errors"
	"io"
	"os/exec"
	"path/filepath"
)

// Resolution is lazy so invalid repository/archive inputs never even select a
// Docker executable. All calls share one resolved path and initial byte identity.
func newLoadedImageDocker() generationExecutor {
	var binary string
	var initial comparisonFileSnapshot
	environment := promiseHostEnvironment()
	return func(ctx context.Context, args []string, sink io.Writer, limit int64) (generationCommandEvidence, error) {
		failure := func(err error) (generationCommandEvidence, error) {
			return generationCommandEvidence{ExitCode: -1, Error: boundedGenerationError(err)}, err
		}
		if !loadedImageReadOnlyArguments(args) || sink != nil || limit != 64<<10 {
			return failure(errors.New("loaded-image Docker adapter accepts only bounded read-only controls"))
		}
		if ctx == nil {
			return failure(errors.New("loaded-image Docker adapter requires a context"))
		}
		if _, bounded := ctx.Deadline(); !bounded {
			return failure(errors.New("loaded-image Docker adapter requires a deadline"))
		}
		if err := ctx.Err(); err != nil {
			return failure(err)
		}
		if binary == "" {
			path, err := exec.LookPath("docker")
			if err != nil {
				return failure(err)
			}
			path, err = filepath.Abs(path)
			if err == nil {
				path, err = filepath.EvalSymlinks(path)
			}
			if err != nil {
				return failure(err)
			}
			_, initial, err = readComparisonFile(ctx, filepath.Dir(path), filepath.Base(path), 128<<20)
			if err != nil {
				return failure(err)
			}
			binary = path
		}
		if err := recheckLoadedImageExecutable(ctx, binary, initial); err != nil {
			return failure(err)
		}
		record, runErr := executeGenerationCommand(ctx, binary, append([]string{"--host", generationDockerEndpoint}, args...), environment, nil, limit)
		checkErr := recheckLoadedImageExecutable(ctx, binary, initial)
		err := errors.Join(runErr, checkErr, ctx.Err())
		if err != nil {
			record.Error = boundedGenerationError(err)
		}
		return record, err
	}
}

func recheckLoadedImageExecutable(ctx context.Context, binary string, initial comparisonFileSnapshot) error {
	_, current, err := readComparisonFile(ctx, filepath.Dir(binary), filepath.Base(binary), 128<<20)
	if err == nil && (current.sha256 != initial.sha256 || !unchangedGeneratorFile(initial.info, current.info)) {
		err = errors.New("resolved Docker executable changed during loaded-image observation")
	}
	return err
}
