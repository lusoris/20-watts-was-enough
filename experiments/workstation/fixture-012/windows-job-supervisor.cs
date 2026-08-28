#nullable enable

using Microsoft.Win32.SafeHandles;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Fixture012.WindowsJobSupervisor
{
    public static class Program
    {
        public const string ProtocolVersion = "fixture-012.windows-job-supervisor.v1";

        private const uint CREATE_SUSPENDED = 0x00000004;
        private const uint CREATE_UNICODE_ENVIRONMENT = 0x00000400;
        private const uint EXTENDED_STARTUPINFO_PRESENT = 0x00080000;
        private const uint STARTF_USESTDHANDLES = 0x00000100;
        private const uint HANDLE_FLAG_INHERIT = 0x00000001;
        private const uint JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE = 0x00002000;
        private const uint WAIT_OBJECT_0 = 0x00000000;
        private const uint WAIT_TIMEOUT = 0x00000102;
        private const uint WAIT_FAILED = 0xffffffff;
        private const uint GENERIC_READ = 0x80000000;
        private const uint FILE_READ_ATTRIBUTES = 0x00000080;
        private const uint FILE_SHARE_READ = 0x00000001;
        private const uint FILE_SHARE_WRITE = 0x00000002;
        private const uint FILE_ATTRIBUTE_DIRECTORY = 0x00000010;
        private const uint FILE_ATTRIBUTE_REPARSE_POINT = 0x00000400;
        private const uint FILE_FLAG_OPEN_REPARSE_POINT = 0x00200000;
        private const uint FILE_FLAG_BACKUP_SEMANTICS = 0x02000000;
        private const uint FILE_FLAG_OVERLAPPED = 0x40000000;
        private const uint OPEN_EXISTING = 3;
        private const uint DRIVE_FIXED = 3;
        private const uint FSCTL_REQUEST_OPLOCK = 0x00090240;
        private const uint FSCTL_READ_FILE_USN_DATA = 0x000900eb;
        private const uint OPLOCK_LEVEL_CACHE_READ = 0x00000001;
        private const uint REQUEST_OPLOCK_INPUT_FLAG_REQUEST = 0x00000001;
        private const int ERROR_IO_PENDING = 997;
        private const int ERROR_NOT_FOUND = 1168;
        private const uint OUTPUT_LIMIT_EXIT_CODE = 0xe0120001;
        private const uint TIMEOUT_EXIT_CODE = 0xe0120002;
        private const uint DESCENDANT_CLEANUP_EXIT_CODE = 0xe0120003;
        private const uint PATH_IDENTITY_EXIT_CODE = 0xe0120004;
        private static readonly IntPtr PROC_THREAD_ATTRIBUTE_HANDLE_LIST = new IntPtr(0x00020002);
        private static readonly IntPtr PROC_THREAD_ATTRIBUTE_JOB_LIST = new IntPtr(0x0002000d);

        private sealed class Request
        {
            public int schema { get; set; }
            public string protocol_version { get; set; } = "";
            public string executable { get; set; } = "";
            public string executable_sha256 { get; set; } = "";
            public string[] args { get; set; } = Array.Empty<string>();
            public string cwd { get; set; } = "";
            public Dictionary<string, string> environment { get; set; } = new Dictionary<string, string>();
            public LockedInput[] locked_inputs { get; set; } = Array.Empty<LockedInput>();
            public int timeout_ms { get; set; }
            public int max_output_bytes { get; set; }
        }

        private sealed class LockedInput
        {
            public string path { get; set; } = "";
            public string sha256 { get; set; } = "";
        }

        private sealed class Response
        {
            public int schema { get; set; } = 1;
            public string protocol_version { get; set; } = ProtocolVersion;
            public string status { get; set; } = "";
            public string monotonic_started_ns { get; set; } = "";
            public string monotonic_ended_ns { get; set; } = "";
            public long? exit_code { get; set; }
            public string termination { get; set; } = "";
            public string stdout_base64 { get; set; } = "";
            public string stderr_base64 { get; set; } = "";
            public bool kill_on_job_close { get; set; }
            public bool assigned_before_resume { get; set; }
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct SECURITY_ATTRIBUTES
        {
            public int nLength;
            public IntPtr lpSecurityDescriptor;
            public int bInheritHandle;
        }

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
        private struct STARTUPINFO
        {
            public int cb;
            public string? lpReserved;
            public string? lpDesktop;
            public string? lpTitle;
            public uint dwX;
            public uint dwY;
            public uint dwXSize;
            public uint dwYSize;
            public uint dwXCountChars;
            public uint dwYCountChars;
            public uint dwFillAttribute;
            public uint dwFlags;
            public ushort wShowWindow;
            public ushort cbReserved2;
            public IntPtr lpReserved2;
            public IntPtr hStdInput;
            public IntPtr hStdOutput;
            public IntPtr hStdError;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_INFORMATION
        {
            public IntPtr hProcess;
            public IntPtr hThread;
            public uint dwProcessId;
            public uint dwThreadId;
        }

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
        private struct STARTUPINFOEX
        {
            public STARTUPINFO StartupInfo;
            public IntPtr lpAttributeList;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct JOBOBJECT_BASIC_LIMIT_INFORMATION
        {
            public long PerProcessUserTimeLimit;
            public long PerJobUserTimeLimit;
            public uint LimitFlags;
            public UIntPtr MinimumWorkingSetSize;
            public UIntPtr MaximumWorkingSetSize;
            public uint ActiveProcessLimit;
            public UIntPtr Affinity;
            public uint PriorityClass;
            public uint SchedulingClass;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct IO_COUNTERS
        {
            public ulong ReadOperationCount;
            public ulong WriteOperationCount;
            public ulong OtherOperationCount;
            public ulong ReadTransferCount;
            public ulong WriteTransferCount;
            public ulong OtherTransferCount;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct JOBOBJECT_EXTENDED_LIMIT_INFORMATION
        {
            public JOBOBJECT_BASIC_LIMIT_INFORMATION BasicLimitInformation;
            public IO_COUNTERS IoInfo;
            public UIntPtr ProcessMemoryLimit;
            public UIntPtr JobMemoryLimit;
            public UIntPtr PeakProcessMemoryUsed;
            public UIntPtr PeakJobMemoryUsed;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct JOBOBJECT_BASIC_ACCOUNTING_INFORMATION
        {
            public long TotalUserTime;
            public long TotalKernelTime;
            public long ThisPeriodTotalUserTime;
            public long ThisPeriodTotalKernelTime;
            public uint TotalPageFaultCount;
            public uint TotalProcesses;
            public uint ActiveProcesses;
            public uint TotalTerminatedProcesses;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct FILE_ATTRIBUTE_TAG_INFO
        {
            public uint FileAttributes;
            public uint ReparseTag;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct BY_HANDLE_FILE_INFORMATION
        {
            public uint FileAttributes;
            public uint CreationTimeLow;
            public uint CreationTimeHigh;
            public uint LastAccessTimeLow;
            public uint LastAccessTimeHigh;
            public uint LastWriteTimeLow;
            public uint LastWriteTimeHigh;
            public uint VolumeSerialNumber;
            public uint FileSizeHigh;
            public uint FileSizeLow;
            public uint NumberOfLinks;
            public uint FileIndexHigh;
            public uint FileIndexLow;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct OVERLAPPED
        {
            public IntPtr Internal;
            public IntPtr InternalHigh;
            public uint Offset;
            public uint OffsetHigh;
            public IntPtr hEvent;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct REQUEST_OPLOCK_INPUT_BUFFER
        {
            public ushort StructureVersion;
            public ushort StructureLength;
            public uint RequestedOplockLevel;
            public uint Flags;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct READ_FILE_USN_DATA
        {
            public ushort MinMajorVersion;
            public ushort MaxMajorVersion;
        }

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool CreateProcessW(
            string lpApplicationName,
            StringBuilder lpCommandLine,
            IntPtr lpProcessAttributes,
            IntPtr lpThreadAttributes,
            [MarshalAs(UnmanagedType.Bool)] bool bInheritHandles,
            uint dwCreationFlags,
            IntPtr lpEnvironment,
            string lpCurrentDirectory,
            ref STARTUPINFOEX lpStartupInfo,
            out PROCESS_INFORMATION lpProcessInformation);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool InitializeProcThreadAttributeList(
            IntPtr lpAttributeList,
            int dwAttributeCount,
            int dwFlags,
            ref IntPtr lpSize);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool UpdateProcThreadAttribute(
            IntPtr lpAttributeList,
            uint dwFlags,
            IntPtr Attribute,
            IntPtr lpValue,
            IntPtr cbSize,
            IntPtr lpPreviousValue,
            IntPtr lpReturnSize);

        [DllImport("kernel32.dll")]
        private static extern void DeleteProcThreadAttributeList(IntPtr lpAttributeList);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool CreatePipe(out IntPtr hReadPipe, out IntPtr hWritePipe, ref SECURITY_ATTRIBUTES lpPipeAttributes, uint nSize);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetHandleInformation(IntPtr hObject, uint dwMask, uint dwFlags);

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern IntPtr CreateFileW(
            string lpFileName,
            uint dwDesiredAccess,
            uint dwShareMode,
            ref SECURITY_ATTRIBUTES lpSecurityAttributes,
            uint dwCreationDisposition,
            uint dwFlagsAndAttributes,
            IntPtr hTemplateFile);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool GetFileInformationByHandleEx(
            SafeFileHandle hFile,
            int FileInformationClass,
            out FILE_ATTRIBUTE_TAG_INFO lpFileInformation,
            uint dwBufferSize);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool GetFileInformationByHandle(
            SafeFileHandle hFile,
            out BY_HANDLE_FILE_INFORMATION lpFileInformation);

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool QueryFullProcessImageNameW(
            IntPtr hProcess,
            uint dwFlags,
            StringBuilder lpExeName,
            ref uint lpdwSize);

        [DllImport("kernel32.dll", CharSet = CharSet.Unicode)]
        private static extern uint GetDriveTypeW(string lpRootPathName);

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern uint QueryDosDeviceW(
            string lpDeviceName,
            StringBuilder lpTargetPath,
            int ucchMax);

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool GetVolumeNameForVolumeMountPointW(
            string lpszVolumeMountPoint,
            StringBuilder lpszVolumeName,
            uint cchBufferLength);

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern uint GetWindowsDirectoryW(StringBuilder lpBuffer, uint uSize);

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern IntPtr CreateEventW(
            IntPtr lpEventAttributes,
            [MarshalAs(UnmanagedType.Bool)] bool bManualReset,
            [MarshalAs(UnmanagedType.Bool)] bool bInitialState,
            string? lpName);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool DeviceIoControl(
            SafeFileHandle hDevice,
            uint dwIoControlCode,
            IntPtr lpInBuffer,
            uint nInBufferSize,
            IntPtr lpOutBuffer,
            uint nOutBufferSize,
            IntPtr lpBytesReturned,
            IntPtr lpOverlapped);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool CancelIoEx(SafeFileHandle hFile, IntPtr lpOverlapped);

        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern IntPtr CreateJobObjectW(IntPtr lpJobAttributes, string? lpName);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetInformationJobObject(
            IntPtr hJob,
            int JobObjectInfoClass,
            ref JOBOBJECT_EXTENDED_LIMIT_INFORMATION lpJobObjectInfo,
            uint cbJobObjectInfoLength);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool QueryInformationJobObject(
            IntPtr hJob,
            int JobObjectInfoClass,
            out JOBOBJECT_BASIC_ACCOUNTING_INFORMATION lpJobObjectInfo,
            uint cbJobObjectInfoLength,
            IntPtr lpReturnLength);

        [DllImport("kernel32.dll", SetLastError = true, EntryPoint = "QueryInformationJobObject")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool QueryJobProcessIds(
            IntPtr hJob,
            int JobObjectInfoClass,
            IntPtr lpJobObjectInfo,
            uint cbJobObjectInfoLength,
            IntPtr lpReturnLength);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern uint ResumeThread(IntPtr hThread);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern uint WaitForSingleObject(IntPtr hHandle, uint dwMilliseconds);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool GetExitCodeProcess(IntPtr hProcess, out uint lpExitCode);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool TerminateJobObject(IntPtr hJob, uint uExitCode);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool TerminateProcess(IntPtr hProcess, uint uExitCode);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool CloseHandle(IntPtr hObject);

        private sealed class OutputBudget
        {
            private readonly object gate = new object();
            private readonly int limit;
            private int retained;
            private bool exceeded;

            public OutputBudget(int limitBytes)
            {
                limit = limitBytes;
            }

            public bool Exceeded
            {
                get { lock (gate) return exceeded; }
            }

            public int RetainCount(int requested)
            {
                lock (gate)
                {
                    int available = Math.Max(0, limit - retained);
                    int accepted = Math.Min(available, requested);
                    retained += accepted;
                    if (accepted < requested) exceeded = true;
                    return accepted;
                }
            }
        }

        private sealed class PathOplockGuard : IDisposable
        {
            private SafeFileHandle handle;
            private IntPtr breakEvent;
            private IntPtr overlapped;
            private IntPtr inputBuffer;
            private IntPtr outputBuffer;
            private SafeFileHandle? usnHandle;
            private bool cancellationRequested;
            private readonly bool expectedDirectory;
            private readonly uint initialAttributes;
            private readonly uint initialReparseTag;
            private readonly uint initialVolumeSerialNumber;
            private readonly uint initialFileIndexHigh;
            private readonly uint initialFileIndexLow;
            private readonly long initialUsn;
            public string GuardedPath { get; }

            public PathOplockGuard(
                string guardedPath,
                SafeFileHandle handle,
                IntPtr breakEvent,
                IntPtr overlapped,
                IntPtr inputBuffer,
                IntPtr outputBuffer,
                bool expectedDirectory,
                FILE_ATTRIBUTE_TAG_INFO initialInformation,
                BY_HANDLE_FILE_INFORMATION initialIdentity,
                SafeFileHandle? usnHandle,
                long initialUsn)
            {
                GuardedPath = guardedPath;
                this.handle = handle;
                this.breakEvent = breakEvent;
                this.overlapped = overlapped;
                this.inputBuffer = inputBuffer;
                this.outputBuffer = outputBuffer;
                this.usnHandle = usnHandle;
                this.expectedDirectory = expectedDirectory;
                initialAttributes = initialInformation.FileAttributes;
                initialReparseTag = initialInformation.ReparseTag;
                initialVolumeSerialNumber = initialIdentity.VolumeSerialNumber;
                initialFileIndexHigh = initialIdentity.FileIndexHigh;
                initialFileIndexLow = initialIdentity.FileIndexLow;
                this.initialUsn = initialUsn;
            }

            public bool Broken
            {
                get
                {
                    if (breakEvent == IntPtr.Zero) return false;
                    uint wait = WaitForSingleObject(breakEvent, 0);
                    if (wait == WAIT_OBJECT_0) return true;
                    if (wait == WAIT_TIMEOUT) return false;
                    throw new IOException("Path oplock event wait failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
                }
            }

            public void ValidateAttributes()
            {
                Require(GetFileInformationByHandleEx(
                    handle,
                    9,
                    out FILE_ATTRIBUTE_TAG_INFO information,
                    (uint)Marshal.SizeOf<FILE_ATTRIBUTE_TAG_INFO>()), "GetFileInformationByHandleEx(path-recheck)");
                bool isDirectory = (information.FileAttributes & FILE_ATTRIBUTE_DIRECTORY) != 0;
                Require(GetFileInformationByHandle(handle, out BY_HANDLE_FILE_INFORMATION identity), "GetFileInformationByHandle(path-recheck)");
                long currentUsn = expectedDirectory
                    ? 0
                    : ReadFileUsn(usnHandle ?? throw new InvalidOperationException("Guarded file USN handle is missing."));
                if ((information.FileAttributes & FILE_ATTRIBUTE_REPARSE_POINT) != 0 ||
                    information.ReparseTag != 0 ||
                    isDirectory != expectedDirectory ||
                    information.FileAttributes != initialAttributes ||
                    information.ReparseTag != initialReparseTag ||
                    identity.VolumeSerialNumber != initialVolumeSerialNumber ||
                    identity.FileIndexHigh != initialFileIndexHigh ||
                    identity.FileIndexLow != initialFileIndexLow ||
                    (!expectedDirectory && identity.NumberOfLinks != 1) ||
                    (!expectedDirectory && currentUsn != initialUsn))
                {
                    throw new InvalidDataException("Guarded path identity changed: " + GuardedPath);
                }
            }

            public int RequestCancellation()
            {
                if (cancellationRequested || breakEvent == IntPtr.Zero || handle.IsInvalid || handle.IsClosed) return 0;
                cancellationRequested = true;
                bool cancelled = CancelIoEx(handle, overlapped);
                if (cancelled) return 0;
                int error = Marshal.GetLastWin32Error();
                return error == ERROR_NOT_FOUND ? 0 : error;
            }

            public uint WaitForCancellation(uint timeoutMilliseconds)
            {
                if (breakEvent == IntPtr.Zero) return WAIT_OBJECT_0;
                return WaitForSingleObject(breakEvent, timeoutMilliseconds);
            }

            public void Release(bool ioCompleted)
            {
                usnHandle?.Dispose();
                usnHandle = null;
                if (handle.IsInvalid || handle.IsClosed) return;
                handle.Dispose();
                if (ioCompleted && breakEvent != IntPtr.Zero)
                {
                    Marshal.FreeHGlobal(overlapped);
                    Marshal.FreeHGlobal(inputBuffer);
                    Marshal.FreeHGlobal(outputBuffer);
                    CloseHandle(breakEvent);
                }
                // On an anomalous global cancellation timeout retain native
                // buffers and the event until this one-request host exits;
                // freeing them could race a still-pending kernel I/O packet.
                overlapped = IntPtr.Zero;
                inputBuffer = IntPtr.Zero;
                outputBuffer = IntPtr.Zero;
                breakEvent = IntPtr.Zero;
            }

            public void Dispose()
            {
                int cancelError = RequestCancellation();
                uint wait = WaitForCancellation(10000);
                Release(wait == WAIT_OBJECT_0);
                if (cancelError != 0) throw new IOException("CancelIoEx(path-oplock) failed with Win32 error " + cancelError + ".");
                if (wait == WAIT_FAILED) throw new IOException("Path oplock cancellation wait failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
            }
        }

        private static async Task<byte[]> DrainPipeAsync(IntPtr readHandle, OutputBudget budget)
        {
            using var handle = new SafeFileHandle(readHandle, ownsHandle: true);
            using var stream = new FileStream(handle, FileAccess.Read, 4096, isAsync: false);
            using var retained = new MemoryStream();
            var buffer = new byte[8192];
            while (true)
            {
                int count = await stream.ReadAsync(buffer, 0, buffer.Length).ConfigureAwait(false);
                if (count == 0) break;
                int accepted = budget.RetainCount(count);
                if (accepted > 0) retained.Write(buffer, 0, accepted);
            }
            return retained.ToArray();
        }

        private static void Require(bool condition, string operation)
        {
            if (!condition) throw new InvalidOperationException(operation + " failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
        }

        private static string Sha256Hex(Stream stream)
        {
            using var hasher = SHA256.Create();
            return string.Concat(hasher.ComputeHash(stream).Select(value => value.ToString("x2")));
        }

        private static string DosDeviceTarget(string deviceName)
        {
            var target = new StringBuilder(32768);
            uint length = QueryDosDeviceW(deviceName, target, target.Capacity);
            if (length == 0) throw new IOException("QueryDosDeviceW failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
            string value = target.ToString();
            int terminator = value.IndexOf('\0');
            return terminator < 0 ? value : value.Substring(0, terminator);
        }

        private static void RequireDirectFixedVolume(string root, string label)
        {
            if (GetDriveTypeW(root) != DRIVE_FIXED) throw new InvalidDataException(label + " must use a fixed local volume.");
            var volumeName = new StringBuilder(64);
            Require(GetVolumeNameForVolumeMountPointW(root, volumeName, (uint)volumeName.Capacity), "GetVolumeNameForVolumeMountPointW");
            string volume = volumeName.ToString();
            if (!volume.StartsWith("\\\\?\\Volume{", StringComparison.OrdinalIgnoreCase) || !volume.EndsWith("}\\", StringComparison.Ordinal))
            {
                throw new InvalidDataException(label + " has an invalid volume identity.");
            }
            string driveTarget = DosDeviceTarget(root.Substring(0, 2));
            string volumeTarget = DosDeviceTarget(volume.Substring(4, volume.Length - 5));
            if (!string.Equals(driveTarget, volumeTarget, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidDataException(label + " must not use SUBST, a mapped drive, or another redirected DOS-device root.");
            }
        }

        private static string ProtectedSystemDriveRoot()
        {
            var windowsDirectory = new StringBuilder(32768);
            uint length = GetWindowsDirectoryW(windowsDirectory, (uint)windowsDirectory.Capacity);
            if (length == 0 || length >= windowsDirectory.Capacity) throw new IOException("GetWindowsDirectoryW failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
            string? root = Path.GetPathRoot(windowsDirectory.ToString());
            if (root == null || root.Length != 3) throw new InvalidDataException("Windows system directory has an invalid drive root.");
            RequireDirectFixedVolume(root, "Windows system directory");
            return root;
        }

        private static string LocalPath(string value, string label)
        {
            string full = Path.GetFullPath(value);
            string? root = Path.GetPathRoot(full);
            if (root == null || root.Length != 3 || !char.IsLetter(root[0]) || root[1] != ':' || (root[2] != '\\' && root[2] != '/'))
            {
                throw new InvalidDataException(label + " must use a local drive-rooted path.");
            }
            if (full.IndexOf(':', 2) >= 0) throw new InvalidDataException(label + " must not address an alternate data stream.");
            RequireDirectFixedVolume(root, label);
            if (!string.Equals(root, ProtectedSystemDriveRoot(), StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidDataException(label + " must remain on the protected Windows system-volume drive mapping.");
            }
            return full;
        }

        private static SafeFileHandle OpenPathGuard(string path, bool directory, uint desiredAccess, uint shareMode)
        {
            var security = new SECURITY_ATTRIBUTES
            {
                nLength = Marshal.SizeOf<SECURITY_ATTRIBUTES>(),
                lpSecurityDescriptor = IntPtr.Zero,
                bInheritHandle = 0,
            };
            uint flags = FILE_FLAG_OPEN_REPARSE_POINT | (directory ? FILE_FLAG_BACKUP_SEMANTICS : 0);
            IntPtr raw = CreateFileW(path, desiredAccess, shareMode, ref security, OPEN_EXISTING, flags, IntPtr.Zero);
            if (raw == new IntPtr(-1)) throw new IOException("Unable to guard path component; Win32 error " + Marshal.GetLastWin32Error() + ".");
            var handle = new SafeFileHandle(raw, ownsHandle: true);
            try
            {
                Require(GetFileInformationByHandleEx(
                    handle,
                    9,
                    out FILE_ATTRIBUTE_TAG_INFO information,
                    (uint)Marshal.SizeOf<FILE_ATTRIBUTE_TAG_INFO>()), "GetFileInformationByHandleEx(FileAttributeTagInfo)");
                if ((information.FileAttributes & FILE_ATTRIBUTE_REPARSE_POINT) != 0 || information.ReparseTag != 0) throw new InvalidDataException("Guarded path traverses a reparse point.");
                bool isDirectory = (information.FileAttributes & FILE_ATTRIBUTE_DIRECTORY) != 0;
                if (isDirectory != directory) throw new InvalidDataException("Guarded path component type is invalid.");
                return handle;
            }
            catch
            {
                handle.Dispose();
                throw;
            }
        }

        private static long ReadFileUsn(SafeFileHandle handle)
        {
            var request = new READ_FILE_USN_DATA
            {
                MinMajorVersion = 2,
                MaxMajorVersion = 3,
            };
            IntPtr input = Marshal.AllocHGlobal(Marshal.SizeOf<READ_FILE_USN_DATA>());
            IntPtr output = Marshal.AllocHGlobal(512);
            IntPtr bytesReturned = Marshal.AllocHGlobal(sizeof(uint));
            try
            {
                Marshal.StructureToPtr(request, input, fDeleteOld: false);
                Marshal.Copy(new byte[512], 0, output, 512);
                Marshal.WriteInt32(bytesReturned, 0);
                if (!DeviceIoControl(
                    handle,
                    FSCTL_READ_FILE_USN_DATA,
                    input,
                    (uint)Marshal.SizeOf<READ_FILE_USN_DATA>(),
                    output,
                    512,
                    bytesReturned,
                    IntPtr.Zero))
                {
                    throw new InvalidDataException("The guarded file system does not expose a readable per-file USN; Win32 error " + Marshal.GetLastWin32Error() + ".");
                }
                uint length = unchecked((uint)Marshal.ReadInt32(bytesReturned));
                uint recordLength = unchecked((uint)Marshal.ReadInt32(output, 0));
                ushort majorVersion = unchecked((ushort)Marshal.ReadInt16(output, 4));
                int usnOffset = majorVersion == 2 ? 24 : majorVersion == 3 ? 40 : -1;
                if (usnOffset < 0 || length < usnOffset + sizeof(long) || recordLength < usnOffset + sizeof(long) || recordLength > length)
                {
                    throw new InvalidDataException("The guarded file returned an invalid per-file USN record.");
                }
                return Marshal.ReadInt64(output, usnOffset);
            }
            finally
            {
                Marshal.FreeHGlobal(input);
                Marshal.FreeHGlobal(output);
                Marshal.FreeHGlobal(bytesReturned);
            }
        }

        private static PathOplockGuard OpenPathOplockGuard(string path, bool directory, bool monitorNamespace = true)
        {
            var security = new SECURITY_ATTRIBUTES
            {
                nLength = Marshal.SizeOf<SECURITY_ATTRIBUTES>(),
                lpSecurityDescriptor = IntPtr.Zero,
                bInheritHandle = 0,
            };
            IntPtr raw = CreateFileW(
                path,
                FILE_READ_ATTRIBUTES,
                FILE_SHARE_READ,
                ref security,
                OPEN_EXISTING,
                (directory ? FILE_FLAG_BACKUP_SEMANTICS : 0) | FILE_FLAG_OPEN_REPARSE_POINT | FILE_FLAG_OVERLAPPED,
                IntPtr.Zero);
            if (raw == new IntPtr(-1)) throw new IOException("Unable to monitor guarded path; Win32 error " + Marshal.GetLastWin32Error() + ".");
            var handle = new SafeFileHandle(raw, ownsHandle: true);
            IntPtr breakEvent = IntPtr.Zero;
            IntPtr overlapped = IntPtr.Zero;
            IntPtr inputBuffer = IntPtr.Zero;
            IntPtr outputBuffer = IntPtr.Zero;
            SafeFileHandle? usnHandle = null;
            long initialUsn = 0;
            try
            {
                Require(GetFileInformationByHandleEx(
                    handle,
                    9,
                    out FILE_ATTRIBUTE_TAG_INFO information,
                    (uint)Marshal.SizeOf<FILE_ATTRIBUTE_TAG_INFO>()), "GetFileInformationByHandleEx(path)");
                Require(GetFileInformationByHandle(handle, out BY_HANDLE_FILE_INFORMATION identity), "GetFileInformationByHandle(path)");
                bool isDirectory = (information.FileAttributes & FILE_ATTRIBUTE_DIRECTORY) != 0;
                if ((information.FileAttributes & FILE_ATTRIBUTE_REPARSE_POINT) != 0 ||
                    information.ReparseTag != 0 ||
                    isDirectory != directory)
                {
                    throw new InvalidDataException("Guarded path is a reparse point or has the wrong component type.");
                }
                if (!directory && identity.NumberOfLinks != 1)
                {
                    throw new InvalidDataException("Guarded files must have exactly one hard-link name.");
                }
                if (!directory)
                {
                    usnHandle = OpenPathGuard(path, directory: false, GENERIC_READ, FILE_SHARE_READ);
                    Require(GetFileInformationByHandle(usnHandle, out BY_HANDLE_FILE_INFORMATION usnIdentity), "GetFileInformationByHandle(file-usn)");
                    if (usnIdentity.VolumeSerialNumber != identity.VolumeSerialNumber ||
                        usnIdentity.FileIndexHigh != identity.FileIndexHigh ||
                        usnIdentity.FileIndexLow != identity.FileIndexLow)
                    {
                        throw new InvalidDataException("Guarded file changed while its USN handle was opened.");
                    }
                    initialUsn = ReadFileUsn(usnHandle);
                }
                if (!monitorNamespace)
                {
                    var identityGuard = new PathOplockGuard(
                        path,
                        handle,
                        IntPtr.Zero,
                        IntPtr.Zero,
                        IntPtr.Zero,
                        IntPtr.Zero,
                        directory,
                        information,
                        identity,
                        usnHandle,
                        initialUsn);
                    handle = new SafeFileHandle(IntPtr.Zero, ownsHandle: true);
                    usnHandle = null;
                    identityGuard.ValidateAttributes();
                    return identityGuard;
                }
                breakEvent = CreateEventW(IntPtr.Zero, bManualReset: true, bInitialState: false, null);
                if (breakEvent == IntPtr.Zero) throw new IOException("CreateEventW(path-oplock) failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
                var state = new OVERLAPPED { hEvent = breakEvent };
                overlapped = Marshal.AllocHGlobal(Marshal.SizeOf<OVERLAPPED>());
                Marshal.StructureToPtr(state, overlapped, fDeleteOld: false);
                var request = new REQUEST_OPLOCK_INPUT_BUFFER
                {
                    StructureVersion = 1,
                    StructureLength = (ushort)Marshal.SizeOf<REQUEST_OPLOCK_INPUT_BUFFER>(),
                    // An R oplock is advisory and sticky: an incompatible path
                    // operation completes this request without an acknowledgement
                    // round-trip that could block the writer.
                    RequestedOplockLevel = OPLOCK_LEVEL_CACHE_READ,
                    Flags = REQUEST_OPLOCK_INPUT_FLAG_REQUEST,
                };
                inputBuffer = Marshal.AllocHGlobal(Marshal.SizeOf<REQUEST_OPLOCK_INPUT_BUFFER>());
                Marshal.StructureToPtr(request, inputBuffer, fDeleteOld: false);
                outputBuffer = Marshal.AllocHGlobal(64);
                Marshal.Copy(new byte[64], 0, outputBuffer, 64);
                bool completed = DeviceIoControl(
                    handle,
                    FSCTL_REQUEST_OPLOCK,
                    inputBuffer,
                    (uint)Marshal.SizeOf<REQUEST_OPLOCK_INPUT_BUFFER>(),
                    outputBuffer,
                    64,
                    IntPtr.Zero,
                    overlapped);
                int error = completed ? 0 : Marshal.GetLastWin32Error();
                if (completed || error != ERROR_IO_PENDING)
                {
                    throw new InvalidDataException("Path R oplock was not granted; Win32 result " + error + ".");
                }
                var guard = new PathOplockGuard(
                    path,
                    handle,
                    breakEvent,
                    overlapped,
                    inputBuffer,
                    outputBuffer,
                    directory,
                    information,
                    identity,
                    usnHandle,
                    initialUsn);
                handle = new SafeFileHandle(IntPtr.Zero, ownsHandle: true);
                usnHandle = null;
                breakEvent = IntPtr.Zero;
                overlapped = IntPtr.Zero;
                inputBuffer = IntPtr.Zero;
                outputBuffer = IntPtr.Zero;
                guard.ValidateAttributes();
                if (guard.Broken)
                {
                    guard.Dispose();
                    throw new InvalidDataException("Path identity oplock broke during acquisition.");
                }
                return guard;
            }
            finally
            {
                handle.Dispose();
                usnHandle?.Dispose();
                if (overlapped != IntPtr.Zero) Marshal.FreeHGlobal(overlapped);
                if (inputBuffer != IntPtr.Zero) Marshal.FreeHGlobal(inputBuffer);
                if (outputBuffer != IntPtr.Zero) Marshal.FreeHGlobal(outputBuffer);
                if (breakEvent != IntPtr.Zero) CloseHandle(breakEvent);
            }
        }

        private static void ValidatePathGuards(IEnumerable<PathOplockGuard> guards)
        {
            foreach (PathOplockGuard guard in guards)
            {
                guard.ValidateAttributes();
                if (guard.Broken) throw new InvalidDataException("Guarded path namespace changed: " + guard.GuardedPath);
            }
        }

        private static bool PathIdentityIntact(IEnumerable<PathOplockGuard> guards)
        {
            try
            {
                ValidatePathGuards(guards);
                return true;
            }
            catch (Exception error) when (
                error is IOException ||
                error is InvalidDataException ||
                error is InvalidOperationException)
            {
                return false;
            }
        }

        private static Exception? DisposePathGuards(IReadOnlyList<PathOplockGuard> guards)
        {
            var failures = new List<Exception>();
            foreach (PathOplockGuard guard in guards)
            {
                int error = guard.RequestCancellation();
                if (error != 0) failures.Add(new IOException("CancelIoEx(path-oplock) failed with Win32 error " + error + "."));
            }

            long deadline = Stopwatch.GetTimestamp() + (10L * Stopwatch.Frequency);
            foreach (PathOplockGuard guard in guards)
            {
                long remainingTicks = Math.Max(0, deadline - Stopwatch.GetTimestamp());
                uint remainingMilliseconds = (uint)Math.Min(
                    10000,
                    Math.Ceiling(remainingTicks * 1000.0 / Stopwatch.Frequency));
                uint wait = guard.WaitForCancellation(remainingMilliseconds);
                bool completed = wait == WAIT_OBJECT_0;
                if (wait == WAIT_FAILED)
                {
                    failures.Add(new IOException("Path oplock cancellation wait failed with Win32 error " + Marshal.GetLastWin32Error() + "."));
                }
                try
                {
                    guard.Release(completed);
                }
                catch (Exception error)
                {
                    failures.Add(error);
                }
            }
            return failures.Count == 0 ? null : new AggregateException("Path guard cleanup failed.", failures);
        }

        private static void GuardDirectoryComponents(
            string fullPath,
            bool includeLeaf,
            List<PathOplockGuard> guards,
            HashSet<string> guardedPaths,
            HashSet<string> namespaceGuardedPaths)
        {
            string root = Path.GetPathRoot(fullPath)!;
            var components = fullPath.Substring(root.Length)
                .Split(new[] { '\\', '/' }, StringSplitOptions.RemoveEmptyEntries);
            int count = includeLeaf ? components.Length : Math.Max(0, components.Length - 1);
            string current = root;
            if (guardedPaths.Add(current))
            {
                // Holding the ancestor without delete sharing prevents its
                // rename or replacement. A directory R oplock here would also
                // report unrelated sibling creation anywhere below a shared
                // root (including C:\), producing false identity breaks.
                guards.Add(OpenPathOplockGuard(current, directory: true, monitorNamespace: false));
                ValidatePathGuards(guards);
            }
            for (int index = 0; index < count; index += 1)
            {
                current = Path.Combine(current, components[index]);
                bool monitorNamespace = index == count - 1;
                if (guardedPaths.Add(current))
                {
                    guards.Add(OpenPathOplockGuard(current, directory: true, monitorNamespace));
                    if (monitorNamespace) namespaceGuardedPaths.Add(current);
                    ValidatePathGuards(guards);
                }
                else if (monitorNamespace && namespaceGuardedPaths.Add(current))
                {
                    // A path first encountered as an ancestor still needs an
                    // oplock when a later guarded path makes it the leaf.
                    guards.Add(OpenPathOplockGuard(current, directory: true));
                    ValidatePathGuards(guards);
                }
            }
        }

        private static FileStream OpenGuardedFile(
            string path,
            List<PathOplockGuard> guards,
            HashSet<string> guardedDirectoryPaths,
            HashSet<string> namespaceGuardedDirectoryPaths,
            HashSet<string> guardedFilePaths)
        {
            string full = LocalPath(path, "Guarded file");
            GuardDirectoryComponents(full, includeLeaf: false, guards, guardedDirectoryPaths, namespaceGuardedDirectoryPaths);
            if (guardedFilePaths.Add(full))
            {
                guards.Add(OpenPathOplockGuard(full, directory: false));
                ValidatePathGuards(guards);
            }
            SafeFileHandle handle = OpenPathGuard(full, directory: false, GENERIC_READ, FILE_SHARE_READ);
            var stream = new FileStream(handle, FileAccess.Read, 4096, isAsync: false);
            try
            {
                ValidatePathGuards(guards);
                return stream;
            }
            catch
            {
                stream.Dispose();
                throw;
            }
        }

        private static void VerifySuspendedProcessImage(IntPtr process, string expectedExecutable)
        {
            uint length = 32768;
            var image = new StringBuilder((int)length);
            Require(QueryFullProcessImageNameW(process, 0, image, ref length), "QueryFullProcessImageNameW");
            string actual = LocalPath(image.ToString(), "Suspended process image");
            if (!string.Equals(actual, expectedExecutable, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidDataException("Suspended process image does not match the guarded executable path.");
            }
        }

        private static string QuoteArgument(string value)
        {
            if (value.Length > 0 && value.All(character => character != ' ' && character != '\t' && character != '\n' && character != '\v' && character != '"')) return value;
            var result = new StringBuilder("\"");
            int backslashes = 0;
            foreach (char character in value)
            {
                if (character == '\\')
                {
                    backslashes += 1;
                }
                else if (character == '"')
                {
                    result.Append('\\', backslashes * 2 + 1);
                    result.Append('"');
                    backslashes = 0;
                }
                else
                {
                    result.Append('\\', backslashes);
                    result.Append(character);
                    backslashes = 0;
                }
            }
            result.Append('\\', backslashes * 2);
            result.Append('"');
            return result.ToString();
        }

        private static string Nanoseconds(long stopwatchTicks)
        {
            BigInteger numerator = new BigInteger(stopwatchTicks) * 1000000000;
            return (numerator / Stopwatch.Frequency).ToString();
        }

        private static void ValidateRequestShape(string requestJson)
        {
            using JsonDocument document = JsonDocument.Parse(requestJson);
            JsonElement root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object) throw new InvalidDataException("Supervisor request must be an object.");
            string[] required = {
                "schema", "protocol_version", "executable", "executable_sha256",
                "args", "cwd", "environment", "locked_inputs", "timeout_ms",
                "max_output_bytes",
            };
            string[] names = root.EnumerateObject().Select(property => property.Name).ToArray();
            if (names.Length != required.Length || names.Distinct(StringComparer.Ordinal).Count() != required.Length || required.Any(name => !names.Contains(name, StringComparer.Ordinal))) throw new InvalidDataException("Supervisor request has an inexact field set.");
            JsonElement args = root.GetProperty("args");
            if (args.ValueKind != JsonValueKind.Array || args.EnumerateArray().Any(value => value.ValueKind != JsonValueKind.String)) throw new InvalidDataException("Supervisor args must be a string array.");
            JsonElement environment = root.GetProperty("environment");
            if (environment.ValueKind != JsonValueKind.Object) throw new InvalidDataException("Supervisor environment must be an object.");
            string[] environmentNames = environment.EnumerateObject().Select(property => property.Name).ToArray();
            if (environmentNames.Distinct(StringComparer.Ordinal).Count() != environmentNames.Length || environment.EnumerateObject().Any(property => property.Value.ValueKind != JsonValueKind.String)) throw new InvalidDataException("Supervisor environment entries are invalid.");
            JsonElement lockedInputs = root.GetProperty("locked_inputs");
            if (lockedInputs.ValueKind != JsonValueKind.Array) throw new InvalidDataException("Supervisor locked_inputs must be an array.");
            foreach (JsonElement input in lockedInputs.EnumerateArray())
            {
                if (input.ValueKind != JsonValueKind.Object) throw new InvalidDataException("Locked input must be an object.");
                string[] inputNames = input.EnumerateObject().Select(property => property.Name).ToArray();
                if (inputNames.Length != 2 || inputNames.Distinct(StringComparer.Ordinal).Count() != 2 || !inputNames.Contains("path", StringComparer.Ordinal) || !inputNames.Contains("sha256", StringComparer.Ordinal)) throw new InvalidDataException("Locked input has an inexact field set.");
                if (input.GetProperty("path").ValueKind != JsonValueKind.String || input.GetProperty("sha256").ValueKind != JsonValueKind.String) throw new InvalidDataException("Locked input values are invalid.");
            }
        }

        private static void WaitForEmptyJob(IntPtr job)
        {
            long deadline = Stopwatch.GetTimestamp() + 10L * Stopwatch.Frequency;
            while (true)
            {
                Require(QueryInformationJobObject(
                    job,
                    1,
                    out JOBOBJECT_BASIC_ACCOUNTING_INFORMATION accounting,
                    (uint)Marshal.SizeOf<JOBOBJECT_BASIC_ACCOUNTING_INFORMATION>(),
                    IntPtr.Zero), "QueryInformationJobObject");
                if (accounting.ActiveProcesses == 0) return;
                if (Stopwatch.GetTimestamp() >= deadline) throw new InvalidOperationException("Job Object still has active processes after termination.");
                Thread.Sleep(10);
            }
        }

        private static uint ActiveJobProcesses(IntPtr job)
        {
            Require(QueryInformationJobObject(
                job,
                1,
                out JOBOBJECT_BASIC_ACCOUNTING_INFORMATION accounting,
                (uint)Marshal.SizeOf<JOBOBJECT_BASIC_ACCOUNTING_INFORMATION>(),
                IntPtr.Zero), "QueryInformationJobObject");
            return accounting.ActiveProcesses;
        }

        private static bool JobHasProcessOtherThan(IntPtr job, uint leaderProcessId)
        {
            const int capacity = 1024;
            int headerBytes = sizeof(uint) * 2;
            int bufferBytes = headerBytes + (capacity * IntPtr.Size);
            IntPtr buffer = Marshal.AllocHGlobal(bufferBytes);
            try
            {
                for (int offset = 0; offset < bufferBytes; offset += 1) Marshal.WriteByte(buffer, offset, 0);
                Require(QueryJobProcessIds(job, 3, buffer, (uint)bufferBytes, IntPtr.Zero), "QueryInformationJobObject(process-id-list)");
                uint assigned = unchecked((uint)Marshal.ReadInt32(buffer, 0));
                uint listed = unchecked((uint)Marshal.ReadInt32(buffer, sizeof(uint)));
                if (assigned > capacity || listed > capacity || listed > assigned)
                {
                    throw new InvalidOperationException("Job Object process-id list exceeded its bounded capacity.");
                }
                for (int index = 0; index < listed; index += 1)
                {
                    long processId = IntPtr.Size == 8
                        ? Marshal.ReadInt64(buffer, headerBytes + (index * IntPtr.Size))
                        : Marshal.ReadInt32(buffer, headerBytes + (index * IntPtr.Size));
                    if (processId != leaderProcessId) return true;
                }
                return false;
            }
            finally
            {
                Marshal.FreeHGlobal(buffer);
            }
        }

        private static IntPtr EnvironmentBlock(Dictionary<string, string> environment)
        {
            if (environment.Keys.Any(key => string.IsNullOrWhiteSpace(key) || key.Contains('=') || key.Contains('\0'))) throw new InvalidDataException("Environment key is invalid.");
            if (environment.Keys.Select(key => key.ToUpperInvariant()).Distinct(StringComparer.Ordinal).Count() != environment.Count) throw new InvalidDataException("Environment keys must be unique under Windows case folding.");
            if (environment.Values.Any(value => value == null || value.Contains('\0'))) throw new InvalidDataException("Environment value is invalid.");
            const string injectionPattern = "^(NODE_OPTIONS|NODE_PATH|LD_PRELOAD|LD_LIBRARY_PATH|DYLD_.+|BASH_ENV|ENV|PROMPT_COMMAND|DOTNET_.+|CORECLR_.+|COMPLUS_.+|COR_.+|PSMODULEPATH|POWERSHELL_.+|PYTHONPATH|PYTHONSTARTUP|RUBYOPT|PERL5OPT|JAVA_TOOL_OPTIONS|_JAVA_OPTIONS|JDK_JAVA_OPTIONS|GCONV_PATH)$";
            if (environment.Keys.Any(key => System.Text.RegularExpressions.Regex.IsMatch(key, injectionPattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase))) throw new InvalidDataException("Target environment contains a runtime-injection variable.");
            string block = string.Join("\0", environment.OrderBy(pair => pair.Key, StringComparer.OrdinalIgnoreCase).Select(pair => pair.Key + "=" + pair.Value)) + "\0\0";
            return Marshal.StringToHGlobalUni(block);
        }

        public static string ExecuteJson(string requestJson)
        {
            if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) throw new PlatformNotSupportedException("The Job Object supervisor requires Windows.");
            ValidateRequestShape(requestJson);
            var request = JsonSerializer.Deserialize<Request>(requestJson) ?? throw new InvalidDataException("Request is empty.");
            if (request.schema != 1 || request.protocol_version != ProtocolVersion) throw new InvalidDataException("Supervisor request identity is invalid.");
            if (request.args == null || request.environment == null || request.locked_inputs == null) throw new InvalidDataException("Supervisor arrays or maps are missing.");
            if (request.args.Any(argument => argument == null || argument.Contains('\0'))) throw new InvalidDataException("Supervisor args must be NUL-free strings.");
            if (request.timeout_ms < 1 || request.timeout_ms > 86400000 || request.max_output_bytes < 1 || request.max_output_bytes > 16 * 1024 * 1024) throw new InvalidDataException("Supervisor bounds are invalid.");
            if (!Path.IsPathFullyQualified(request.executable) || !Path.IsPathFullyQualified(request.cwd)) throw new InvalidDataException("Executable and working directory must be absolute.");
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.executable_sha256, "^[0-9a-f]{64}$")) throw new InvalidDataException("Executable digest is invalid.");
            if (request.locked_inputs.Any(input => input == null || !Path.IsPathFullyQualified(input.path) || !System.Text.RegularExpressions.Regex.IsMatch(input.sha256, "^[0-9a-f]{64}$"))) throw new InvalidDataException("Locked input identity is invalid.");
            if (request.locked_inputs.Select(input => Path.GetFullPath(input.path)).Distinct(StringComparer.OrdinalIgnoreCase).Count() != request.locked_inputs.Length) throw new InvalidDataException("Locked input paths must be unique under Windows path comparison.");

            string executable = LocalPath(request.executable, "Executable");
            string cwd = LocalPath(request.cwd, "Working directory");

            IntPtr stdoutRead = IntPtr.Zero;
            IntPtr stdoutWrite = IntPtr.Zero;
            IntPtr stderrRead = IntPtr.Zero;
            IntPtr stderrWrite = IntPtr.Zero;
            IntPtr stdinNull = IntPtr.Zero;
            IntPtr environmentBlock = IntPtr.Zero;
            IntPtr attributeList = IntPtr.Zero;
            IntPtr inheritedHandleList = IntPtr.Zero;
            IntPtr jobHandleList = IntPtr.Zero;
            IntPtr job = IntPtr.Zero;
            var lockedInputStreams = new List<FileStream>();
            var pathGuards = new List<PathOplockGuard>();
            var guardedDirectoryPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var namespaceGuardedDirectoryPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var guardedFilePaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            PROCESS_INFORMATION process = new PROCESS_INFORMATION();
            Task<byte[]>? stdoutTask = null;
            Task<byte[]>? stderrTask = null;
            bool assignedBeforeResume = false;
            bool killOnJobClose = false;
            bool processSignalled = false;
            long startedTicks = 0;
            long endedTicks = 0;
            string status = "completed";
            string termination = "natural-exit";
            uint exitCode = 0;

            var security = new SECURITY_ATTRIBUTES
            {
                nLength = Marshal.SizeOf<SECURITY_ATTRIBUTES>(),
                lpSecurityDescriptor = IntPtr.Zero,
                bInheritHandle = 1,
            };
            var budget = new OutputBudget(request.max_output_bytes);

            try
            {
                Require(CreatePipe(out stdoutRead, out stdoutWrite, ref security, 0), "CreatePipe(stdout)");
                Require(SetHandleInformation(stdoutRead, HANDLE_FLAG_INHERIT, 0), "SetHandleInformation(stdout)");
                Require(CreatePipe(out stderrRead, out stderrWrite, ref security, 0), "CreatePipe(stderr)");
                Require(SetHandleInformation(stderrRead, HANDLE_FLAG_INHERIT, 0), "SetHandleInformation(stderr)");
                stdinNull = CreateFileW("NUL", GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE, ref security, OPEN_EXISTING, 0, IntPtr.Zero);
                if (stdinNull == new IntPtr(-1)) throw new InvalidOperationException("CreateFile(NUL) failed with Win32 error " + Marshal.GetLastWin32Error() + ".");

                GuardDirectoryComponents(cwd, includeLeaf: true, pathGuards, guardedDirectoryPaths, namespaceGuardedDirectoryPaths);

                foreach (LockedInput input in request.locked_inputs)
                {
                    var stream = OpenGuardedFile(input.path, pathGuards, guardedDirectoryPaths, namespaceGuardedDirectoryPaths, guardedFilePaths);
                    if (!string.Equals(Sha256Hex(stream), input.sha256, StringComparison.Ordinal))
                    {
                        stream.Dispose();
                        throw new InvalidDataException("Locked input content identity mismatch inside supervisor.");
                    }
                    lockedInputStreams.Add(stream);
                }

                using var executableLock = OpenGuardedFile(executable, pathGuards, guardedDirectoryPaths, namespaceGuardedDirectoryPaths, guardedFilePaths);
                string actualExecutableSha256 = Sha256Hex(executableLock);
                if (!string.Equals(actualExecutableSha256, request.executable_sha256, StringComparison.Ordinal)) throw new InvalidDataException("Target executable content identity mismatch inside supervisor.");

                environmentBlock = EnvironmentBlock(request.environment);
                job = CreateJobObjectW(IntPtr.Zero, null);
                if (job == IntPtr.Zero) throw new InvalidOperationException("CreateJobObjectW failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
                var limits = new JOBOBJECT_EXTENDED_LIMIT_INFORMATION();
                limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
                Require(SetInformationJobObject(job, 9, ref limits, (uint)Marshal.SizeOf<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>()), "SetInformationJobObject");
                killOnJobClose = true;

                var startup = new STARTUPINFOEX
                {
                    StartupInfo = new STARTUPINFO
                    {
                        cb = Marshal.SizeOf<STARTUPINFOEX>(),
                        dwFlags = STARTF_USESTDHANDLES,
                        hStdInput = stdinNull,
                        hStdOutput = stdoutWrite,
                        hStdError = stderrWrite,
                    },
                };
                IntPtr attributeBytes = IntPtr.Zero;
                InitializeProcThreadAttributeList(IntPtr.Zero, 2, 0, ref attributeBytes);
                if (attributeBytes == IntPtr.Zero) throw new InvalidOperationException("InitializeProcThreadAttributeList(size) failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
                attributeList = Marshal.AllocHGlobal(attributeBytes);
                Require(InitializeProcThreadAttributeList(attributeList, 2, 0, ref attributeBytes), "InitializeProcThreadAttributeList");
                startup.lpAttributeList = attributeList;
                inheritedHandleList = Marshal.AllocHGlobal(IntPtr.Size * 3);
                Marshal.WriteIntPtr(inheritedHandleList, 0, stdinNull);
                Marshal.WriteIntPtr(inheritedHandleList, IntPtr.Size, stdoutWrite);
                Marshal.WriteIntPtr(inheritedHandleList, IntPtr.Size * 2, stderrWrite);
                Require(UpdateProcThreadAttribute(
                    attributeList,
                    0,
                    PROC_THREAD_ATTRIBUTE_HANDLE_LIST,
                    inheritedHandleList,
                    new IntPtr(IntPtr.Size * 3),
                    IntPtr.Zero,
                    IntPtr.Zero), "UpdateProcThreadAttribute(handle-list)");
                jobHandleList = Marshal.AllocHGlobal(IntPtr.Size);
                Marshal.WriteIntPtr(jobHandleList, job);
                Require(UpdateProcThreadAttribute(
                    attributeList,
                    0,
                    PROC_THREAD_ATTRIBUTE_JOB_LIST,
                    jobHandleList,
                    new IntPtr(IntPtr.Size),
                    IntPtr.Zero,
                    IntPtr.Zero), "UpdateProcThreadAttribute(job-list)");

                foreach (string guardedRoot in new[] { executable, cwd }
                    .Concat(request.locked_inputs.Select(input => input.path))
                    .Select(path => Path.GetPathRoot(Path.GetFullPath(path))!)
                    .Distinct(StringComparer.OrdinalIgnoreCase))
                {
                    RequireDirectFixedVolume(guardedRoot, "Guarded path");
                }
                ValidatePathGuards(pathGuards);

                var commandLine = new StringBuilder(string.Join(" ", new[] { executable }.Concat(request.args).Select(QuoteArgument)));
                startedTicks = Stopwatch.GetTimestamp();
                Require(CreateProcessW(
                    executable,
                    commandLine,
                    IntPtr.Zero,
                    IntPtr.Zero,
                    true,
                    CREATE_SUSPENDED | CREATE_UNICODE_ENVIRONMENT | EXTENDED_STARTUPINFO_PRESENT,
                    environmentBlock,
                    cwd,
                    ref startup,
                    out process), "CreateProcessW");
                assignedBeforeResume = true;
                VerifySuspendedProcessImage(process.hProcess, executable);
                ValidatePathGuards(pathGuards);

                CloseHandle(stdoutWrite);
                stdoutWrite = IntPtr.Zero;
                CloseHandle(stderrWrite);
                stderrWrite = IntPtr.Zero;
                CloseHandle(stdinNull);
                stdinNull = IntPtr.Zero;

                stdoutTask = DrainPipeAsync(stdoutRead, budget);
                stdoutRead = IntPtr.Zero;
                stderrTask = DrainPipeAsync(stderrRead, budget);
                stderrRead = IntPtr.Zero;
                if (ResumeThread(process.hThread) == uint.MaxValue) throw new InvalidOperationException("ResumeThread failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
                CloseHandle(process.hThread);
                process.hThread = IntPtr.Zero;

                long deadlineTicks = startedTicks + (long)Math.Ceiling(request.timeout_ms * (double)Stopwatch.Frequency / 1000.0);
                while (true)
                {
                    uint wait = WaitForSingleObject(process.hProcess, 10);
                    if (wait == WAIT_OBJECT_0) break;
                    if (wait == WAIT_FAILED) throw new InvalidOperationException("WaitForSingleObject failed with Win32 error " + Marshal.GetLastWin32Error() + ".");
                    if (wait != WAIT_TIMEOUT) throw new InvalidOperationException("WaitForSingleObject returned an unexpected status.");
                    if (!PathIdentityIntact(pathGuards))
                    {
                        status = "path-identity-break";
                        termination = "windows-job-terminated";
                        Require(TerminateJobObject(job, PATH_IDENTITY_EXIT_CODE), "TerminateJobObject(path-identity-break)");
                        Require(WaitForSingleObject(process.hProcess, 10000) == WAIT_OBJECT_0, "WaitForSingleObject(path-identity-break)");
                        break;
                    }
                    if (budget.Exceeded)
                    {
                        status = "output-limit";
                        termination = "windows-job-terminated";
                        Require(TerminateJobObject(job, OUTPUT_LIMIT_EXIT_CODE), "TerminateJobObject(output-limit)");
                        Require(WaitForSingleObject(process.hProcess, 10000) == WAIT_OBJECT_0, "WaitForSingleObject(output-limit)");
                        break;
                    }
                    if (Stopwatch.GetTimestamp() >= deadlineTicks)
                    {
                        status = "timeout";
                        termination = "windows-job-terminated";
                        Require(TerminateJobObject(job, TIMEOUT_EXIT_CODE), "TerminateJobObject(timeout)");
                        Require(WaitForSingleObject(process.hProcess, 10000) == WAIT_OBJECT_0, "WaitForSingleObject(timeout)");
                        break;
                    }
                }
                endedTicks = Stopwatch.GetTimestamp();
                processSignalled = true;
                if (status == "completed" && !PathIdentityIntact(pathGuards))
                {
                    status = "path-identity-break";
                    termination = "windows-job-terminated";
                }
                if (status == "completed" && endedTicks >= deadlineTicks)
                {
                    status = "timeout";
                    termination = "windows-job-terminated";
                }
                Require(GetExitCodeProcess(process.hProcess, out exitCode), "GetExitCodeProcess");
                CloseHandle(process.hProcess);
                process.hProcess = IntPtr.Zero;

                // Job accounting may retain the already-signalled leader for
                // a short interval. Classify a leak from the process-id list,
                // not the lagging aggregate active-process count.
                if (status == "completed" && JobHasProcessOtherThan(job, process.dwProcessId))
                {
                    status = "descendant-survived";
                    termination = "windows-job-terminated";
                }

                // The measured leader is already signalled. Terminate the job
                // once more to catch every surviving descendant, then prove the
                // active-process count reached zero before closing the handle.
                Require(TerminateJobObject(job, DESCENDANT_CLEANUP_EXIT_CODE), "TerminateJobObject(descendant-cleanup)");
                WaitForEmptyJob(job);
                if (status == "completed" && !PathIdentityIntact(pathGuards))
                {
                    status = "path-identity-break";
                    termination = "windows-job-terminated";
                }
                CloseHandle(job);
                job = IntPtr.Zero;

                byte[] stdout = stdoutTask.GetAwaiter().GetResult();
                byte[] stderr = stderrTask.GetAwaiter().GetResult();
                if (status == "completed" && budget.Exceeded)
                {
                    status = "output-limit";
                    termination = "windows-job-terminated";
                }
                if (status == "completed" && !PathIdentityIntact(pathGuards))
                {
                    status = "path-identity-break";
                    termination = "windows-job-terminated";
                }
                var response = new Response
                {
                    status = status,
                    monotonic_started_ns = Nanoseconds(startedTicks),
                    monotonic_ended_ns = Nanoseconds(endedTicks),
                    exit_code = exitCode,
                    termination = termination,
                    stdout_base64 = Convert.ToBase64String(stdout),
                    stderr_base64 = Convert.ToBase64String(stderr),
                    kill_on_job_close = killOnJobClose,
                    assigned_before_resume = assignedBeforeResume,
                };
                return JsonSerializer.Serialize(response);
            }
            finally
            {
                Exception? cleanupFailure = null;
                try
                {
                    if (job != IntPtr.Zero)
                    {
                        Require(TerminateJobObject(job, DESCENDANT_CLEANUP_EXIT_CODE), "TerminateJobObject(exception-cleanup)");
                        WaitForEmptyJob(job);
                        if (process.hProcess != IntPtr.Zero)
                        {
                            Require(WaitForSingleObject(process.hProcess, 10000) == WAIT_OBJECT_0, "WaitForSingleObject(exception-cleanup)");
                        }
                    }
                    else if (process.hProcess != IntPtr.Zero && !processSignalled)
                    {
                        Require(TerminateProcess(process.hProcess, DESCENDANT_CLEANUP_EXIT_CODE), "TerminateProcess(unassigned-cleanup)");
                        Require(WaitForSingleObject(process.hProcess, 10000) == WAIT_OBJECT_0, "WaitForSingleObject(unassigned-cleanup)");
                    }
                }
                catch (Exception error)
                {
                    cleanupFailure = error;
                }
                if (job != IntPtr.Zero) CloseHandle(job);
                if (process.hThread != IntPtr.Zero) CloseHandle(process.hThread);
                if (process.hProcess != IntPtr.Zero) CloseHandle(process.hProcess);
                if (stdoutWrite != IntPtr.Zero) CloseHandle(stdoutWrite);
                if (stderrWrite != IntPtr.Zero) CloseHandle(stderrWrite);
                if (stdinNull != IntPtr.Zero && stdinNull != new IntPtr(-1)) CloseHandle(stdinNull);
                if (stdoutRead != IntPtr.Zero) CloseHandle(stdoutRead);
                if (stderrRead != IntPtr.Zero) CloseHandle(stderrRead);
                if (environmentBlock != IntPtr.Zero) Marshal.FreeHGlobal(environmentBlock);
                if (attributeList != IntPtr.Zero) DeleteProcThreadAttributeList(attributeList);
                if (attributeList != IntPtr.Zero) Marshal.FreeHGlobal(attributeList);
                if (inheritedHandleList != IntPtr.Zero) Marshal.FreeHGlobal(inheritedHandleList);
                if (jobHandleList != IntPtr.Zero) Marshal.FreeHGlobal(jobHandleList);
                try
                {
                    foreach (FileStream stream in lockedInputStreams) stream.Dispose();
                }
                catch (Exception error)
                {
                    cleanupFailure = cleanupFailure == null ? error : new AggregateException(cleanupFailure, error);
                }
                Exception? guardCleanupFailure = DisposePathGuards(pathGuards);
                if (guardCleanupFailure != null)
                {
                    cleanupFailure = cleanupFailure == null
                        ? guardCleanupFailure
                        : new AggregateException(cleanupFailure, guardCleanupFailure);
                }
                if (cleanupFailure != null) throw new InvalidOperationException("Supervisor could not prove complete cleanup.", cleanupFailure);
            }
        }
    }
}
