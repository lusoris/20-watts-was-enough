package strictjson

import (
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
