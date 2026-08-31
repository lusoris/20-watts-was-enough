package pdftools

import (
	"errors"
	"fmt"
	"net/url"
	"path"
	"slices"
	"strings"
)

type retentionManifest struct {
	Schema       int               `json:"schema"`
	Contract     string            `json:"contract"`
	Platform     string            `json:"platform"`
	PackageCount int               `json:"package_count"`
	TotalBytes   int64             `json:"total_bytes"`
	Packages     []retainedPackage `json:"packages"`
}

type retainedPackage struct {
	Name            string `json:"name"`
	Version         string `json:"version"`
	Architecture    string `json:"architecture"`
	URL             string `json:"url"`
	Filename        string `json:"filename"`
	Size            int64  `json:"size_bytes"`
	SHA256          string `json:"sha256"`
	LicenseDeclared string `json:"license_declared"`
}

func loadRetention(root string, contract Contract, locked map[string]lockPackage) (retentionManifest, error) {
	relative := "tooling/pdf-tools/" + contract.SourceDelivery.APKManifest
	body, err := readRelative(root, relative, "PDF-tools APK retention manifest", 256*1024)
	if err != nil {
		return retentionManifest{}, err
	}
	if rawDigest(body) != contract.SourceDelivery.APKManifestSHA256 {
		return retentionManifest{}, errors.New("PDF-tools APK retention manifest digest does not match contract.json")
	}
	manifest, err := decodeCanonical[retentionManifest](body, 6, "PDF-tools APK retention manifest")
	if err != nil {
		return retentionManifest{}, err
	}
	if err := validateRetention(manifest, contract, locked); err != nil {
		return retentionManifest{}, err
	}
	return manifest, nil
}

func validateRetention(value retentionManifest, contract Contract, locked map[string]lockPackage) error {
	if value.Schema != 1 || value.Contract != "publication.pdf-tools-apk-retention.v1" || value.Platform != contract.Platform {
		return errors.New("APK retention schema, contract, or platform is invalid")
	}
	if value.PackageCount != len(value.Packages) || value.PackageCount != len(locked) || value.PackageCount > contract.Limits.Packages {
		return errors.New("APK retention package count does not match the lock")
	}
	if !slices.IsSortedFunc(value.Packages, func(left, right retainedPackage) int { return strings.Compare(left.Name, right.Name) }) {
		return errors.New("APK retention packages must be sorted by name")
	}
	var total int64
	seen := make(map[string]struct{}, len(value.Packages))
	for _, retained := range value.Packages {
		lockedPackage, exists := locked[retained.Name]
		if !exists {
			return fmt.Errorf("APK retention records unlocked package %s", retained.Name)
		}
		if err := validateRetainedPackage(retained, lockedPackage); err != nil {
			return err
		}
		if _, duplicate := seen[retained.Name]; duplicate {
			return fmt.Errorf("APK retention repeats package %s", retained.Name)
		}
		seen[retained.Name] = struct{}{}
		total += retained.Size
	}
	if total != value.TotalBytes || total <= 0 || total >= contract.Limits.SourceBundleBytes {
		return errors.New("APK retention byte total is invalid or leaves no source-bundle headroom")
	}
	return nil
}

func validateRetainedPackage(retained retainedPackage, locked lockPackage) error {
	if retained.Version != locked.Version || retained.Architecture != locked.Architecture || retained.URL != locked.URL ||
		!rawDigestPattern.MatchString(retained.SHA256) || retained.Size <= 0 || retained.Size > 64*1024*1024 {
		return fmt.Errorf("retained package %s does not match its lock identity", retained.Name)
	}
	parsed, err := url.Parse(retained.URL)
	if err != nil || retained.Filename != path.Base(parsed.Path) || strings.Contains(retained.Filename, "/") {
		return fmt.Errorf("retained package %s filename is invalid", retained.Name)
	}
	if retained.LicenseDeclared == "" || retained.LicenseDeclared == "NOASSERTION" || len(retained.LicenseDeclared) > 256 {
		return fmt.Errorf("retained package %s lacks a bounded declared licence", retained.Name)
	}
	_, dataEnd, err := validateRange(locked.Data, "sha256", 32)
	if err != nil || dataEnd+1 != retained.Size {
		return fmt.Errorf("retained package %s size does not close its lock ranges", retained.Name)
	}
	return nil
}
