// Package buildinfo exposes immutable linker-provided binary identity.
package buildinfo

import "runtime"

var (
	version  = "development"
	revision = "unknown"
	builtAt  = "unknown"
)

// Info describes the exact repository Go binary build.
type Info struct {
	Version      string `json:"version"`
	Revision     string `json:"revision"`
	BuiltAt      string `json:"built_at"`
	GoVersion    string `json:"go_version"`
	OperatingSys string `json:"os"`
	Architecture string `json:"architecture"`
}

// Current returns the current binary identity.
func Current() Info {
	return Info{
		Version:      version,
		Revision:     revision,
		BuiltAt:      builtAt,
		GoVersion:    runtime.Version(),
		OperatingSys: runtime.GOOS,
		Architecture: runtime.GOARCH,
	}
}
