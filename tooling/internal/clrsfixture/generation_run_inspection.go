package clrsfixture

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"maps"
	"reflect"
	"slices"
	"strings"
)

type generationContainerInspection struct {
	ID, Name, Image string
	Config          generationImageConfig
	Mounts          []json.RawMessage
	State           struct {
		Running, Paused, Restarting, OOMKilled, Dead bool
		Status, Error                                string
	}
	NetworkSettings struct {
		Networks, Ports map[string]json.RawMessage
	}
	HostConfig struct {
		Privileged, ReadonlyRootfs, PublishAllPorts, AutoRemove                              bool
		NetworkMode, Runtime, PidMode, IpcMode, UTSMode, CgroupnsMode, UsernsMode            string
		Memory, MemorySwap, NanoCpus, CpuPeriod, CpuQuota, ShmSize                           int64
		PidsLimit                                                                            *int64
		Init, OomKillDisable                                                                 *bool
		CapAdd, CapDrop, SecurityOpt, Binds, VolumesFrom, GroupAdd, DeviceCgroupRules, Links []string
		Devices, DeviceRequests, Mounts                                                      []json.RawMessage
		PortBindings                                                                         map[string]json.RawMessage
		Tmpfs, Sysctls, StorageOpt                                                           map[string]string
		RestartPolicy                                                                        struct {
			Name              string
			MaximumRetryCount int
		}
		LogConfig struct {
			Type   string
			Config map[string]string
		}
	}
}

// Docker inspection has version-specific unrelated fields. Consumed fields are
// case-exact and presence checked; untouched subtrees are not schema attestation.
func generationInspectionObject(body []byte, required, nullable string) (map[string]json.RawMessage, error) {
	var object map[string]json.RawMessage
	if err := decodeStrict(body, 20, &object); err != nil {
		return nil, err
	}
	if object == nil {
		return nil, errors.New("Docker inspection object is null")
	}
	nulls := strings.Fields(nullable)
	for _, key := range strings.Fields(required) {
		value, exists := object[key]
		if !exists || bytes.Equal(bytes.TrimSpace(value), []byte("null")) && !slices.Contains(nulls, key) {
			return nil, fmt.Errorf("Docker inspection lacks non-null exact field %s", key)
		}
	}
	for key := range object {
		for _, exact := range strings.Fields(required + " " + nullable) {
			if key != exact && strings.EqualFold(key, exact) {
				return nil, errors.New("Docker inspection contains a case-aliased consumed field")
			}
		}
	}
	return object, nil
}

func parseGenerationContainerInspection(body []byte, full bool) (value generationContainerInspection, err error) {
	fields := "Id Name Image Config State"
	if full {
		fields += " HostConfig NetworkSettings Mounts"
	}
	object, err := generationInspectionObject(body, fields, "Mounts")
	if err != nil {
		return value, err
	}
	if _, err = generationInspectionObject(object["State"], "Running Paused Restarting OOMKilled Dead Status Error", ""); err != nil {
		return value, err
	}
	if _, err = generationInspectionObject(object["Config"], "Image Labels", ""); err != nil {
		return value, err
	}
	if full {
		err = generationFullInspectionFields(object)
		if err != nil {
			return value, err
		}
	}
	// Docker uses Id; Go's ID field is assigned explicitly after exact-key checks.
	err = json.Unmarshal(body, &value)
	return value, err
}

func generationFullInspectionFields(object map[string]json.RawMessage) error {
	if _, err := generationInspectionObject(object["Config"], "Image User WorkingDir Entrypoint Cmd Env Labels Tty OpenStdin StopTimeout StopSignal", "Volumes ExposedPorts OnBuild Healthcheck"); err != nil {
		return err
	}
	if _, err := generationInspectionObject(object["NetworkSettings"], "Networks Ports", "Ports"); err != nil {
		return err
	}
	if _, exists := object["Mounts"]; !exists {
		return errors.New("Docker inspection lacks Mounts")
	}
	host, err := generationInspectionObject(object["HostConfig"],
		"Privileged ReadonlyRootfs PublishAllPorts AutoRemove NetworkMode Runtime PidMode IpcMode UTSMode CgroupnsMode UsernsMode Memory MemorySwap NanoCpus CpuPeriod CpuQuota PidsLimit CapDrop SecurityOpt RestartPolicy LogConfig Tmpfs",
		"Init OomKillDisable CapAdd Binds VolumesFrom GroupAdd Devices DeviceRequests DeviceCgroupRules Mounts Links PortBindings Sysctls StorageOpt")
	if err != nil {
		return err
	}
	for _, name := range []string{"Init", "OomKillDisable"} {
		if value, exists := host[name]; exists && string(value) != "null" {
			var flag bool
			if err := json.Unmarshal(value, &flag); err != nil {
				return err
			}
		}
	}
	if _, err := generationInspectionObject(host["RestartPolicy"], "Name MaximumRetryCount", ""); err != nil {
		return err
	}
	_, err = generationInspectionObject(host["LogConfig"], "Type Config", "Config")
	return err
}

func validateGenerationImageInspection(body []byte, expected generationImageInspection) error {
	object, err := generationInspectionObject(body, "Id Os Architecture Config RootFS", "")
	if err != nil {
		return err
	}
	if _, err := generationInspectionObject(object["Config"], "User WorkingDir Entrypoint Env", "Image Cmd Labels OnBuild Volumes ExposedPorts Healthcheck StopTimeout StopSignal Tty OpenStdin"); err != nil {
		return err
	}
	var config map[string]json.RawMessage
	if err := json.Unmarshal(object["Config"], &config); err != nil {
		return err
	}
	for _, field := range []string{"Image", "StopSignal", "Tty", "OpenStdin"} {
		if value, exists := config[field]; exists && bytes.Equal(bytes.TrimSpace(value), []byte("null")) {
			return errors.New("loaded image inspection contains a null consumed scalar")
		}
	}
	if _, err := generationInspectionObject(object["RootFS"], "Type Layers", ""); err != nil {
		return err
	}
	var value generationImageInspection
	if err := json.Unmarshal(body, &value); err != nil {
		return err
	}
	if !reflect.DeepEqual(value, expected) {
		return errors.New("loaded image configuration or diff IDs differ from independently pinned OCI bytes")
	}
	return nil
}

func validateGenerationOwner(value generationContainerInspection, name, priorID, imageID string) error {
	if !lowerHex(value.ID, 64) || priorID != "" && value.ID != priorID || value.Name != "/"+name ||
		value.Image != imageID || value.Config.Image != imageID || value.Config.Labels[generationOwnerLabel] != name {
		return errors.New("container identity or ownership differs from this run; no mutation permitted")
	}
	return nil
}

func validateGenerationContainer(value generationContainerInspection, inputs generationRunInputs, name string, running bool) error {
	c, h, r := value.Config, value.HostConfig, inputs.authority.image.Runtime
	if c.User != fmt.Sprintf("%d:%d", r.UID, r.GID) || c.WorkingDir != r.WorkingDirectory || c.Tty || c.OpenStdin ||
		!slices.Equal(c.Entrypoint, []string{inputs.invocation.PythonExecutable}) || !slices.Equal(c.Cmd, generationIdleArguments(r)) ||
		!slices.Equal(c.Env, inputs.image.Config.Env) || !maps.Equal(c.Labels, map[string]string{generationOwnerLabel: name}) ||
		len(c.Volumes)+len(c.ExposedPorts)+len(c.OnBuild) != 0 || c.Healthcheck != nil ||
		c.StopTimeout == nil || *c.StopTimeout != r.StopGraceSeconds || c.StopSignal != "SIGTERM" {
		return errors.New("container executable or inherited configuration differs from the fixed generation invocation")
	}
	if h.Privileged || !h.ReadonlyRootfs || h.PublishAllPorts || h.AutoRemove || h.Runtime != "runc" ||
		h.NetworkMode != r.Network || h.Memory != r.MemoryBytes || h.MemorySwap != r.MemoryBytes || h.NanoCpus != int64(r.CPUMillis)*1000000 ||
		h.CpuPeriod != 0 || h.CpuQuota != 0 || h.PidsLimit == nil || *h.PidsLimit != int64(r.PIDs) ||
		h.OomKillDisable != nil && *h.OomKillDisable || h.Init != nil && *h.Init || h.RestartPolicy.Name != "no" ||
		h.RestartPolicy.MaximumRetryCount != 0 || !slices.Equal(h.CapDrop, []string{"ALL"}) ||
		!slices.Equal(h.SecurityOpt, []string{"no-new-privileges"}) || h.LogConfig.Type != "none" || len(h.LogConfig.Config) != 0 {
		return errors.New("container safety or resource configuration differs from the frozen limits")
	}
	if h.PidMode != "" || h.IpcMode != "none" || h.UTSMode != "" || h.CgroupnsMode != "private" || h.UsernsMode != "" ||
		len(h.CapAdd)+len(h.Binds)+len(h.VolumesFrom)+len(h.GroupAdd)+len(h.Devices)+len(h.DeviceRequests)+len(h.DeviceCgroupRules)+len(h.Mounts)+len(h.Links)+len(h.PortBindings)+len(h.Sysctls)+len(h.StorageOpt)+len(value.Mounts)+len(value.NetworkSettings.Ports) != 0 ||
		!maps.Equal(h.Tmpfs, map[string]string{r.TemporaryRoot: generationTmpfs(r.TemporaryBytes), r.OutputRoot: generationTmpfs(r.OutputBytes)}) {
		return errors.New("container has unexpected namespaces, devices, privileges, mounts or ports")
	}
	_, isolated := value.NetworkSettings.Networks[r.Network]
	if value.State.Running != running || value.State.Paused || value.State.Restarting || value.State.OOMKilled || value.State.Dead || value.State.Error != "" ||
		!isolated || len(value.NetworkSettings.Networks) != 1 || running && value.State.Status != "running" || !running && value.State.Status != "created" {
		return errors.New("container state or network differs from the required generation boundary")
	}
	return nil
}
