$ErrorActionPreference = 'Stop'
$assemblyPath = $env:FIXTURE012_ASSEMBLY_PATH
$expectedAssemblySha256 = $env:FIXTURE012_ASSEMBLY_SHA256
$version = $env:FIXTURE012_VERSION -ceq '1'
if ([string]::IsNullOrWhiteSpace($assemblyPath) -or $expectedAssemblySha256 -cnotmatch '^[0-9a-f]{64}$') {
    throw 'Supervisor bootstrap environment is invalid.'
}
$resolvedAssembly = (Resolve-Path -LiteralPath $assemblyPath -ErrorAction Stop).Path
$assemblyBytes = [IO.File]::ReadAllBytes($resolvedAssembly)
$actualAssembly = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($assemblyBytes)).ToLowerInvariant()
if ($actualAssembly -cne $expectedAssemblySha256) {
    throw 'Supervisor assembly identity changed before load.'
}
[System.Reflection.Assembly]::Load($assemblyBytes) | Out-Null

if ($Version) {
    [Console]::Out.WriteLine([Fixture012.WindowsJobSupervisor.Program]::ProtocolVersion)
    exit 0
}

$request = [Console]::In.ReadToEnd()
$response = [Fixture012.WindowsJobSupervisor.Program]::ExecuteJson($request)
[Console]::Out.Write($response)
