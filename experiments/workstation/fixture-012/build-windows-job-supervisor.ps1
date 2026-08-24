param(
    [Parameter(Mandatory = $true)]
    [string]$OutputAssembly
)

$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'windows-job-supervisor.cs'
$output = [System.IO.Path]::GetFullPath($OutputAssembly)
$parent = Split-Path -Parent $output
if (-not (Test-Path -LiteralPath $parent -PathType Container)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
}
if (Test-Path -LiteralPath $output) {
    throw "Refusing to overwrite existing supervisor assembly: $output"
}

$sourceBytes = [IO.File]::ReadAllBytes($source)
$strictUtf8 = [Text.UTF8Encoding]::new($false, $true)
$sourceText = $strictUtf8.GetString($sourceBytes)
$sourceSha256 = [Convert]::ToHexString(
    [Security.Cryptography.SHA256]::HashData($sourceBytes)
).ToLowerInvariant()
# Compile the exact byte snapshot hashed above. The compiler never reopens the
# mutable source pathname, so a concurrent rename cannot change the input.
Add-Type -TypeDefinition $sourceText -OutputAssembly $output -OutputType Library -CompilerOptions '/optimize+ /deterministic+'

$hostExecutable = (Get-Process -Id $PID).Path
$harness = Join-Path $PSScriptRoot 'windows-job-supervisor.ps1'
$assemblySha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $output).Hash.ToLowerInvariant()
$harnessBytes = [IO.File]::ReadAllBytes($harness)
$harnessText = $strictUtf8.GetString($harnessBytes)
$harnessSha256 = [Convert]::ToHexString(
    [Security.Cryptography.SHA256]::HashData($harnessBytes)
).ToLowerInvariant()
$encodedHarness = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($harnessText))
$env:FIXTURE012_ASSEMBLY_PATH = $output
$env:FIXTURE012_ASSEMBLY_SHA256 = $assemblySha256
$env:FIXTURE012_VERSION = '1'
$protocolOutput = & $hostExecutable -NoLogo -NoProfile -NonInteractive -EncodedCommand $encodedHarness
if ($LASTEXITCODE -ne 0) {
    throw "Supervisor version probe failed with exit code $LASTEXITCODE."
}

[ordered]@{
    schema = 1
    protocol_version = $protocolOutput.Trim()
    source_path = $source
    source_sha256 = $sourceSha256
    harness_path = $harness
    harness_sha256 = $harnessSha256
    host_executable = $hostExecutable
    host_executable_sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $hostExecutable).Hash.ToLowerInvariant()
    assembly_path = $output
    assembly_sha256 = $assemblySha256
    version_stdout_sha256 = [Convert]::ToHexString(
        [Security.Cryptography.SHA256]::HashData(
            [Text.Encoding]::UTF8.GetBytes("$($protocolOutput.Trim())$([Environment]::NewLine)")
        )
    ).ToLowerInvariant()
} | ConvertTo-Json -Depth 3
