package clrsfixture

import (
	"encoding/json"
	"fmt"
	"path"
)

// Only validated repository authority supplies substitutions. This reader does
// not invoke a shell, accept user code or rely on Docker's tmpfs archive API.
func generationReaderProgram(inputs generationRunInputs) string {
	runtime, output := inputs.authority.image.Runtime, inputs.authority.plan.Output
	names := make([]string, len(inputs.invocation.ExpectedPaths))
	for index, value := range inputs.invocation.ExpectedPaths {
		names[index] = path.Base(value)
	}
	encoded, _ := json.Marshal(names)
	quote := func(value string) string { body, _ := json.Marshal(value); return string(body) }
	return fmt.Sprintf(generationReaderTemplate, encoded, quote(runtime.OutputRoot), quote(inputs.invocation.OutputDirectory),
		quote(inputs.authority.plan.SplitName), output.MaxDatasetBytes, output.MaxTotalBytes,
		runtime.UID, runtime.GID, inputs.authority.image.Builder.SourceDateEpoch)
}

const generationReaderTemplate = `import io, os, stat, sys, tarfile
if sys.flags.optimize != 0:
 raise RuntimeError('optimized Python is outside the checked generation reader')
names = %s
output, dataset, split = %s, %s, %s
file_limit, total_limit, uid, gid, epoch = %d, %d, %d, %d, %d
def entries(path, expected, directories):
 actual = []
 with os.scandir(path) as items:
  for index in range(len(expected) + 1):
   item = next(items, None)
   if item is None:
    break
   if index == len(expected):
    raise ValueError('excess output entries')
   assert (item.is_dir(follow_symlinks=False) if directories else item.is_file(follow_symlinks=False))
   actual.append(item.name)
 assert sorted(actual) == sorted(expected)
def inventory():
 entries(output, ['dataset'], True)
 entries(dataset, [split], True)
 entries(dataset + '/' + split, names, False)
def identity(info):
 return (info.st_dev, info.st_ino, info.st_mode, info.st_uid, info.st_gid, info.st_size, info.st_mtime_ns, info.st_ctime_ns)
inventory()
total = 0
with tarfile.open(fileobj=sys.stdout.buffer, mode='w|', format=tarfile.USTAR_FORMAT) as archive:
 for name in names:
  path = dataset + '/' + split + '/' + name
  descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
  with os.fdopen(descriptor, 'rb') as file:
   before = os.fstat(file.fileno())
   assert stat.S_ISREG(before.st_mode) and 0 < before.st_size <= file_limit
   assert before.st_uid == uid and before.st_gid == gid
   body = file.read(file_limit + 1)
   after = os.fstat(file.fileno())
  named = os.stat(path, follow_symlinks=False)
  assert len(body) == before.st_size and identity(before) == identity(after) == identity(named)
  total += len(body)
  assert total <= total_limit
  member = tarfile.TarInfo(split + '/' + name)
  member.size = len(body)
  member.mode = 0o644
  member.uid, member.gid, member.mtime = uid, gid, epoch
  archive.addfile(member, io.BytesIO(body))
inventory()
`
