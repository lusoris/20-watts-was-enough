package workstationrunner

type processTree interface {
	attach() error
	cleanup() error
}
