package clrsfixture

import (
	"errors"
	"fmt"
	"path"
	"reflect"
	"strconv"
	"strings"
)

func renderGeneratorProgram(inputs invocationInputs) (string, error) {
	plan, err := inputs.contract.Plan(inputs.source)
	if err != nil {
		return "", err
	}
	if !reflect.DeepEqual(plan, inputs.plan) {
		return "", errors.New("CLRS invocation requires the exact validated generation plan")
	}
	module := strings.ReplaceAll(strings.TrimSuffix(inputs.source.Generator.Path, ".py"), "/", ".")
	last := strings.LastIndex(module, ".")
	if last < 1 || !invocationPythonModule(module) {
		return "", errors.New("CLRS generator module must contain only validated Python identifiers")
	}
	moduleParent, moduleName := module[:last], module[last+1:]
	version, err := invocationPythonVersion(inputs.lock.Python.Version)
	if err != nil {
		return "", err
	}
	runtime := inputs.image.Runtime
	output := path.Join(runtime.OutputRoot, "dataset")
	if !strings.HasPrefix(output, runtime.OutputRoot+"/") || output == runtime.OutputRoot {
		return "", errors.New("CLRS invocation output must remain a new child of the output mount")
	}
	var program strings.Builder
	fmt.Fprintf(&program, invocationProgramPrefix, version, runtime.UID, runtime.GID, invocationPythonString(runtime.WorkingDirectory),
		invocationPythonString(path.Join(runtime.SourceRoot, inputs.source.Generator.Path)), maximumInvocationSourceBytes+1,
		maximumInvocationSourceBytes, invocationPythonString(inputs.source.Generator.SHA256), moduleParent, moduleName)
	for _, task := range plan.Tasks {
		lengths := make([]string, 0, len(task.Sizes))
		for _, size := range task.Sizes {
			lengths = append(lengths, strconv.FormatInt(size.RequestedLength, 10))
		}
		fmt.Fprintf(&program, " %s: [%s],\n", invocationPythonString(string(task.Task)), strings.Join(lengths, ", "))
	}
	seeds, quotedSeeds := make([]string, len(plan.Seeds)), make([]string, len(plan.Seeds))
	for index, seed := range plan.Seeds {
		seeds[index] = strconv.FormatInt(seed, 10)
		quotedSeeds[index] = invocationPythonString(seeds[index])
	}
	flags := []string{
		"clrs-bounded-" + plan.SplitName, "--split_name=" + plan.SplitName,
		"--number_of_samples=" + strconv.Itoa(plan.SamplesPerCell), "--path_to_save=" + output,
		"--seeds=" + strings.Join(seeds, ","), "--use_hints=" + strconv.FormatBool(plan.UseHints),
		"--num_decimals_in_float=" + strconv.Itoa(plan.NumDecimalsInFloat),
	}
	for index, value := range flags {
		flags[index] = invocationPythonString(value)
	}
	fmt.Fprintf(&program, invocationProgramSuffix, invocationPythonString(plan.SplitName), plan.SamplesPerCell,
		invocationPythonString(output), strings.Join(quotedSeeds, ", "), invocationPythonBool(plan.UseHints),
		plan.NumDecimalsInFloat, invocationPythonString(output), strings.Join(flags, ", "))
	if program.Len() == 0 || program.Len() > maximumInvocationProgramBytes {
		return "", errors.New("CLRS invocation program exceeds its 16 KiB bound")
	}
	return program.String(), nil
}

// These statements preserve the public ConfigDict/default/parser invocation
// exercised in the retained two-run fixture probe. The generator is not patched.
const invocationProgramPrefix = `import hashlib, os, pathlib, sys
if sys.flags.optimize:
 raise RuntimeError('CLRS invocation requires enabled validation assertions')
assert sys.version_info[:3] == (%s)
assert os.getuid() == %d and os.getgid() == %d and os.getcwd() == %s
source = pathlib.Path(%s)
def check_source():
 assert str(source.resolve(strict=True)) == str(source)
 with source.open('rb') as stream:
  body = stream.read(%d)
 assert 0 < len(body) <= %d and hashlib.sha256(body).hexdigest() == %s
check_source()
from absl import app, flags
from ml_collections import config_dict
from %s import %s as generator
assert pathlib.Path(generator.__file__).resolve(strict=True) == source
mapping = {
`

const invocationProgramSuffix = `}
flags.FLAGS.set_default('algos_and_lengths', config_dict.ConfigDict(mapping, sort_keys=False))
def checked_main(argv):
 assert len(argv) == 1
 assert flags.FLAGS.algos_and_lengths.to_dict() == mapping
 assert list(flags.FLAGS.algos_and_lengths) == list(mapping)
 assert flags.FLAGS.split_name == %s
 assert flags.FLAGS.number_of_samples == %d
 assert flags.FLAGS.path_to_save == %s
 assert flags.FLAGS.seeds == [%s]
 assert flags.FLAGS.use_hints is %s
 assert flags.FLAGS.num_decimals_in_float == %d
 assert not os.path.lexists(%s)
 generator.main(argv)
 check_source()
 print('CLRS_FIXED_GENERATION_COMPLETE_NO_RESULT')
app.run(checked_main, argv=[%s])
`

func invocationPythonString(value string) string {
	// QuoteToASCII emits escapes shared by Go and Python string literals. No
	// caller value is inserted as Python syntax except validated identifiers.
	return strconv.QuoteToASCII(value)
}

func invocationPythonBool(value bool) string {
	if value {
		return "True"
	}
	return "False"
}

func invocationPythonModule(value string) bool {
	if len(value) == 0 || len(value) > 256 {
		return false
	}
	for _, component := range strings.Split(value, ".") {
		if len(component) == 0 {
			return false
		}
		for index, character := range component {
			if (character < 'a' || character > 'z') && (character < 'A' || character > 'Z') && character != '_' &&
				(index == 0 || character < '0' || character > '9') {
				return false
			}
		}
	}
	return true
}

func invocationPythonVersion(value string) (string, error) {
	parts := strings.Split(value, ".")
	if len(parts) != 3 {
		return "", errors.New("CLRS invocation Python version must have three numeric components")
	}
	for _, component := range parts {
		parsed, err := strconv.Atoi(component)
		if err != nil || parsed < 0 || parsed > 999 || strconv.Itoa(parsed) != component {
			return "", errors.New("CLRS invocation Python version component is invalid")
		}
	}
	return strings.Join(parts, ", "), nil
}
