package clrsfixture

import "fmt"

// These fixed Python snippets access the running container's tmpfs. Docker's
// archive API uses a separate filesystem view. Go owns archive validation,
// canonicalization, command limits, exact output checks, and orchestration.
func promiseMaterializer() string {
	return fmt.Sprintf(`import hashlib, io, os, sys, tarfile
body = sys.stdin.buffer.read(%d)
if len(body) != %d or hashlib.sha256(body).hexdigest() != %q:
    raise ValueError("Promise canonical source transfer identity mismatch")
os.umask(0o022)
with tarfile.open(fileobj=io.BytesIO(body), mode="r:", errorlevel=2) as archive:
    members = archive.getmembers()
    archive.extractall("/work", members=members, filter="data")
    for member in members:
        info = os.stat("/work/" + member.name, follow_symlinks=False)
        if (info.st_mode & 0o777) != member.mode or info.st_mtime != member.mtime:
            raise ValueError("Promise materialized source metadata differs")
        if info.st_uid != 65532 or info.st_gid != 65532:
            raise ValueError("Promise materialized source ownership differs")
`, promiseCanonicalTarSize+1, promiseCanonicalTarSize, promiseCanonicalTarSHA256)
}

func promiseOutputReader() string {
	return fmt.Sprintf(`import io, os, stat, sys, tarfile
name = %q
maximum = %d
def identity(info):
    return (info.st_dev, info.st_ino, info.st_mode, info.st_uid, info.st_gid, info.st_size, info.st_mtime_ns, info.st_ctime_ns)
with os.scandir("/output") as entries:
    entry = next(entries, None)
    extra = next(entries, None)
    if entry is None or extra is not None or entry.name != name or not entry.is_file(follow_symlinks=False):
        raise ValueError("Promise output must contain only the named regular wheel")
path = "/output/" + name
descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
with os.fdopen(descriptor, "rb") as wheel:
    before = os.fstat(wheel.fileno())
    if not stat.S_ISREG(before.st_mode) or before.st_size < 1 or before.st_size > maximum:
        raise ValueError("Promise wheel exceeds regular-file size bounds")
    body = wheel.read(maximum + 1)
    after = os.fstat(wheel.fileno())
named = os.stat(path, follow_symlinks=False)
if len(body) != before.st_size or identity(before) != identity(after) or identity(after) != identity(named):
    raise ValueError("Promise wheel changed during bounded readback")
output = io.BytesIO()
with tarfile.open(fileobj=output, mode="w", format=tarfile.USTAR_FORMAT) as archive:
    member = tarfile.TarInfo(name)
    member.size = len(body)
    member.mode = 0o644
    member.uid = member.gid = 65532
    member.mtime = %d
    archive.addfile(member, io.BytesIO(body))
body = output.getvalue()
if len(body) > %d:
    raise ValueError("Promise output tar exceeds its byte limit")
sys.stdout.buffer.write(body)
`, promiseWheelFilename, promiseArchiveFileBytes, generatorSourceDateEpoch, promiseMaximumOutputTarBytes)
}

func promiseTransferArguments(source GeneratorWheelSourceBuild, name, operation string) []string {
	program := promiseOutputReader()
	if operation == "copy-source" {
		program = promiseMaterializer()
	}
	return promiseExecArguments(source, name, operation, []string{"python", "-c", program})
}
