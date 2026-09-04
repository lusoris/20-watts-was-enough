//go:build windows

package workstationrunner

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"sync"
	"syscall"
	"unsafe"
)

const (
	createSuspended                   = 0x00000004
	jobObjectExtendedLimitInformation = 9
	jobObjectLimitKillOnJobClose      = 0x00002000
	processSetQuota                   = 0x0100
	processTerminate                  = 0x0001
	threadSuspendResume               = 0x0002
)

var (
	kernel32                     = syscall.NewLazyDLL("kernel32.dll")
	procAssignProcessToJobObject = kernel32.NewProc("AssignProcessToJobObject")
	procCreateJobObjectW         = kernel32.NewProc("CreateJobObjectW")
	procOpenThread               = kernel32.NewProc("OpenThread")
	procResumeThread             = kernel32.NewProc("ResumeThread")
	procSetInformationJobObject  = kernel32.NewProc("SetInformationJobObject")
	procTerminateJobObject       = kernel32.NewProc("TerminateJobObject")
	procThread32First            = kernel32.NewProc("Thread32First")
	procThread32Next             = kernel32.NewProc("Thread32Next")
)

type windowsBasicLimitInformation struct {
	perProcessUserTimeLimit int64
	perJobUserTimeLimit     int64
	limitFlags              uint32
	minimumWorkingSetSize   uintptr
	maximumWorkingSetSize   uintptr
	activeProcessLimit      uint32
	affinity                uintptr
	priorityClass           uint32
	schedulingClass         uint32
}

type windowsIOCounters struct {
	readOperationCount  uint64
	writeOperationCount uint64
	otherOperationCount uint64
	readTransferCount   uint64
	writeTransferCount  uint64
	otherTransferCount  uint64
}

type windowsExtendedLimitInformation struct {
	basicLimitInformation windowsBasicLimitInformation
	ioInfo                windowsIOCounters
	processMemoryLimit    uintptr
	jobMemoryLimit        uintptr
	peakProcessMemoryUsed uintptr
	peakJobMemoryUsed     uintptr
}

type windowsThreadEntry struct {
	size           uint32
	usage          uint32
	threadID       uint32
	ownerProcessID uint32
	basePriority   int32
	deltaPriority  int32
	flags          uint32
}

type windowsProcessTree struct {
	mutex    sync.Mutex
	command  *exec.Cmd
	job      syscall.Handle
	attached bool
	closed   bool
}

func configureProcessTree(command *exec.Cmd) (processTree, error) {
	jobValue, _, callErr := procCreateJobObjectW.Call(0, 0)
	if jobValue == 0 {
		return nil, windowsAPIFailure("create process job", callErr)
	}
	job := syscall.Handle(jobValue)
	limits := windowsExtendedLimitInformation{}
	limits.basicLimitInformation.limitFlags = jobObjectLimitKillOnJobClose
	configured, _, callErr := procSetInformationJobObject.Call(
		uintptr(job),
		jobObjectExtendedLimitInformation,
		uintptr(unsafe.Pointer(&limits)),
		unsafe.Sizeof(limits),
	)
	if configured == 0 {
		_ = syscall.CloseHandle(job)
		return nil, windowsAPIFailure("configure kill-on-close process job", callErr)
	}
	tree := &windowsProcessTree{command: command, job: job}
	command.SysProcAttr = &syscall.SysProcAttr{
		CreationFlags: syscall.CREATE_NEW_PROCESS_GROUP | createSuspended,
		HideWindow:    true,
	}
	command.Cancel = tree.cancel
	return tree, nil
}

func (tree *windowsProcessTree) attach() error {
	tree.mutex.Lock()
	defer tree.mutex.Unlock()
	if tree.closed || tree.command.Process == nil {
		return errors.New("Windows process job cannot attach to an unavailable process")
	}
	process, err := syscall.OpenProcess(
		processSetQuota|processTerminate,
		false,
		uint32(tree.command.Process.Pid),
	)
	if err != nil {
		return fmt.Errorf("open suspended Windows process: %w", err)
	}
	assigned, _, callErr := procAssignProcessToJobObject.Call(uintptr(tree.job), uintptr(process))
	closeErr := syscall.CloseHandle(process)
	if assigned == 0 {
		return errors.Join(windowsAPIFailure("assign suspended process to job", callErr), closeErr)
	}
	if closeErr != nil {
		return fmt.Errorf("close assigned Windows process handle: %w", closeErr)
	}
	tree.attached = true
	if err := resumeWindowsProcess(uint32(tree.command.Process.Pid)); err != nil {
		_, _, _ = procTerminateJobObject.Call(uintptr(tree.job), 1)
		return err
	}
	return nil
}

func (tree *windowsProcessTree) cancel() error {
	tree.mutex.Lock()
	defer tree.mutex.Unlock()
	if tree.closed || tree.command.Process == nil {
		return os.ErrProcessDone
	}
	if !tree.attached {
		return tree.command.Process.Kill()
	}
	terminated, _, callErr := procTerminateJobObject.Call(uintptr(tree.job), 1)
	if terminated == 0 {
		return windowsAPIFailure("terminate Windows process job", callErr)
	}
	return nil
}

func (tree *windowsProcessTree) cleanup() error {
	tree.mutex.Lock()
	defer tree.mutex.Unlock()
	if tree.closed {
		return nil
	}
	tree.closed = true
	if err := syscall.CloseHandle(tree.job); err != nil {
		return fmt.Errorf("close kill-on-close Windows process job: %w", err)
	}
	return nil
}

func resumeWindowsProcess(processID uint32) error {
	snapshot, err := syscall.CreateToolhelp32Snapshot(syscall.TH32CS_SNAPTHREAD, 0)
	if err != nil {
		return fmt.Errorf("snapshot suspended Windows process threads: %w", err)
	}
	defer syscall.CloseHandle(snapshot)
	entry := windowsThreadEntry{size: uint32(unsafe.Sizeof(windowsThreadEntry{}))}
	first, _, callErr := procThread32First.Call(uintptr(snapshot), uintptr(unsafe.Pointer(&entry)))
	if first == 0 {
		return windowsAPIFailure("enumerate suspended Windows process threads", callErr)
	}
	resumed := 0
	for {
		if entry.ownerProcessID == processID {
			if err := resumeWindowsThread(entry.threadID); err != nil {
				return err
			}
			resumed++
		}
		next, _, _ := procThread32Next.Call(uintptr(snapshot), uintptr(unsafe.Pointer(&entry)))
		if next == 0 {
			break
		}
	}
	if resumed == 0 {
		return errors.New("suspended Windows process has no resumable thread")
	}
	return nil
}

func resumeWindowsThread(threadID uint32) error {
	threadValue, _, callErr := procOpenThread.Call(threadSuspendResume, 0, uintptr(threadID))
	if threadValue == 0 {
		return windowsAPIFailure("open suspended Windows process thread", callErr)
	}
	thread := syscall.Handle(threadValue)
	resumed, _, callErr := procResumeThread.Call(uintptr(thread))
	closeErr := syscall.CloseHandle(thread)
	if uint32(resumed) == ^uint32(0) {
		return errors.Join(windowsAPIFailure("resume Windows process thread", callErr), closeErr)
	}
	if closeErr != nil {
		return fmt.Errorf("close resumed Windows process thread: %w", closeErr)
	}
	return nil
}

func windowsAPIFailure(action string, callErr error) error {
	if errno, ok := callErr.(syscall.Errno); ok && errno != 0 {
		return fmt.Errorf("%s: %w", action, errno)
	}
	return errors.New(action)
}
