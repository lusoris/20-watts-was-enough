package strictjson

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestValidateAcceptsOneUnambiguousValue(t *testing.T) {
	t.Parallel()
	if err := Validate([]byte(`{"outer":{"name":"value"},"items":[1,true,null]}`), 8); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}

func TestValidateRejectsDuplicateNamesAtEveryObjectDepth(t *testing.T) {
	t.Parallel()
	for _, body := range []string{
		`{"name":"left","name":"right"}`,
		`{"outer":{"name":"left","name":"right"}}`,
	} {
		if err := Validate([]byte(body), 8); err == nil || !strings.Contains(err.Error(), "repeats name") {
			t.Fatalf("Validate(%s) error = %v, want duplicate rejection", body, err)
		}
	}
}

func TestValidateRejectsTrailingDataAndDepthExhaustion(t *testing.T) {
	t.Parallel()
	if err := Validate([]byte(`{} {}`), 8); err == nil || !strings.Contains(err.Error(), "trailing") {
		t.Fatalf("Validate() trailing error = %v", err)
	}
	if err := Validate([]byte(`[[[]]]`), 2); err == nil || !strings.Contains(err.Error(), "nesting") {
		t.Fatalf("Validate() depth error = %v", err)
	}
}

func FuzzValidate(f *testing.F) {
	for _, body := range [][]byte{
		[]byte(`{"outer":{"name":"value"},"items":[1,true,null]}`),
		[]byte(`{"name":"left","name":"right"}`),
		[]byte(`{} {}`),
		[]byte(`[[[[[]]]]]`),
		{0x00, 0xff, '{', '}'},
	} {
		f.Add(body)
	}
	f.Fuzz(func(t *testing.T, body []byte) {
		const maximumFuzzInput = 1 << 20
		if len(body) > maximumFuzzInput {
			return
		}
		if err := Validate(body, 64); err == nil && !json.Valid(body) {
			t.Fatalf("Validate accepted input rejected by encoding/json: %q", body)
		}
	})
}
