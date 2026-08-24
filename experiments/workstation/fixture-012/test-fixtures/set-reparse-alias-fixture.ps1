param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("Build", "Set", "Clear", "Pulse")]
    [string]$Mode,

    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$AssemblyPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$source = @'
using Microsoft.Win32.SafeHandles;
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class Fixture012ReparseAlias
{
    private const uint FILE_WRITE_ATTRIBUTES = 0x00000100;
    private const uint FILE_SHARE_READ = 0x00000001;
    private const uint OPEN_EXISTING = 3;
    private const uint FILE_FLAG_OPEN_REPARSE_POINT = 0x00200000;
    private const uint FSCTL_SET_REPARSE_POINT = 0x000900a4;
    private const uint FSCTL_DELETE_REPARSE_POINT = 0x000900ac;
    private const uint TEST_REPARSE_TAG = 0x00000042;
    private static readonly Guid TestGuid = new Guid("b84c0a87-76df-4b33-9f84-77fc78718888");

    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern SafeFileHandle CreateFileW(
        string fileName,
        uint desiredAccess,
        uint shareMode,
        IntPtr securityAttributes,
        uint creationDisposition,
        uint flagsAndAttributes,
        IntPtr templateFile);

    [DllImport("kernel32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool DeviceIoControl(
        SafeFileHandle device,
        uint controlCode,
        byte[] input,
        uint inputLength,
        IntPtr output,
        uint outputLength,
        out uint bytesReturned,
        IntPtr overlapped);

    private static byte[] Header()
    {
        var buffer = new byte[24];
        Array.Copy(BitConverter.GetBytes(TEST_REPARSE_TAG), 0, buffer, 0, 4);
        Array.Copy(TestGuid.ToByteArray(), 0, buffer, 8, 16);
        return buffer;
    }

    public static void Apply(string path, int operation)
    {
        using (SafeFileHandle handle = CreateFileW(
            path,
            FILE_WRITE_ATTRIBUTES,
            FILE_SHARE_READ,
            IntPtr.Zero,
            OPEN_EXISTING,
            FILE_FLAG_OPEN_REPARSE_POINT,
            IntPtr.Zero))
        {
            if (handle.IsInvalid) throw new Win32Exception(Marshal.GetLastWin32Error(), "CreateFileW(reparse alias) failed");
            byte[] buffer = Header();
            uint firstCode = operation == 1 ? FSCTL_DELETE_REPARSE_POINT : FSCTL_SET_REPARSE_POINT;
            if (!DeviceIoControl(handle, firstCode, buffer, (uint)buffer.Length, IntPtr.Zero, 0, out _, IntPtr.Zero))
            {
                throw new Win32Exception(Marshal.GetLastWin32Error(), "DeviceIoControl(reparse alias) failed");
            }
            if (operation == 2 && !DeviceIoControl(handle, FSCTL_DELETE_REPARSE_POINT, buffer, (uint)buffer.Length, IntPtr.Zero, 0, out _, IntPtr.Zero))
            {
                throw new Win32Exception(Marshal.GetLastWin32Error(), "DeviceIoControl(reparse alias restore) failed");
            }
        }
    }
}
'@

if ($Mode -eq "Build") {
    Add-Type -TypeDefinition $source -Language CSharp -OutputAssembly $AssemblyPath -OutputType Library -ErrorAction Stop
    return
}

if ([string]::IsNullOrWhiteSpace($Path)) {
    throw "Path is required for Set and Clear."
}

Add-Type -Path $AssemblyPath -ErrorAction Stop
$operation = if ($Mode -eq "Clear") { 1 } elseif ($Mode -eq "Pulse") { 2 } else { 0 }
[Fixture012ReparseAlias]::Apply($Path, $operation)
