package pdfrender

import (
	"errors"
	"fmt"
)

const maximumGeneratedDockerfileBytes = 64 * 1024

const dockerfileTemplate = `FROM %s AS node-runtime
FROM %s

ARG CHROME_EXECUTABLE_PATH
ARG CHROME_EXECUTABLE_SHA256
ARG CHROME_VERSION
ARG NODE_VERSION
ARG RENDERER_LOCK_SHA256
ARG SOURCE_DATE_EPOCH

USER root
COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node
COPY chrome-linux64 /opt/chrome/chrome-linux64
RUN test "$(node --version)" = "v${NODE_VERSION}" \
    && test "$(sha256sum "${CHROME_EXECUTABLE_PATH}" | cut -d ' ' -f 1)" = "${CHROME_EXECUTABLE_SHA256}"

LABEL io.github.lusoris.20-watts-was-enough.renderer-lock-sha256=${RENDERER_LOCK_SHA256} \
    io.github.lusoris.20-watts-was-enough.renderer-node-version=${NODE_VERSION} \
    io.github.lusoris.20-watts-was-enough.renderer-chrome-version=${CHROME_VERSION}

ENV CHROME_PATH=${CHROME_EXECUTABLE_PATH} \
    HOME=/tmp/home \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    TZ=UTC \
    XDG_CACHE_HOME=/tmp/cache \
    XDG_CONFIG_HOME=/tmp/config

USER 10042
WORKDIR /workspace
ENTRYPOINT ["/usr/local/bin/node", "scripts/generate-book-pdf.mjs"]
`

// generateDockerfile closes the build graph by projecting the two immutable
// base-image identities from the validated renderer lock into literal FROM
// instructions. The template contains no external dependency identity.
func generateDockerfile(lock Lock) ([]byte, error) {
	if err := validateLock(lock); err != nil {
		return nil, fmt.Errorf("validate PDF renderer lock before Dockerfile generation: %w", err)
	}
	body := []byte(fmt.Sprintf(
		dockerfileTemplate,
		lock.Node.Image,
		lock.BrowserEnvironment.Image,
	))
	if len(body) == 0 || len(body) > maximumGeneratedDockerfileBytes {
		return nil, errors.New("generated PDF renderer Dockerfile exceeds its size boundary")
	}
	return body, nil
}
