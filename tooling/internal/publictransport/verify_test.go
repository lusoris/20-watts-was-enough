package publictransport

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"errors"
	"fmt"
	"math/big"
	"net"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

type transportFixture struct {
	root        string
	manifest    Manifest
	client      *http.Client
	clock       time.Time
	httpHits    *atomic.Int32
	httpsHits   *atomic.Int32
	certificate *x509.Certificate
}

func newTransportFixture(t *testing.T, alter func(http.ResponseWriter, *http.Request, bool)) transportFixture {
	t.Helper()
	httpHits := &atomic.Int32{}
	httpsHits := &atomic.Int32{}
	serverCertificate, leaf, roots := newTestCertificate(t, "www.cordana.dev")
	httpsServer := httptest.NewUnstartedServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		httpsHits.Add(1)
		writer.Header().Set("Server", "CloudFlare")
		writer.Header().Set("CF-Ray", "test-ray-FRA")
		if alter != nil {
			alter(writer, request, true)
		}
	}))
	httpsServer.TLS = &tls.Config{
		Certificates: []tls.Certificate{serverCertificate},
		MinVersion:   tls.VersionTLS12,
	}
	httpsServer.StartTLS()
	t.Cleanup(httpsServer.Close)
	httpServer := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		httpHits.Add(1)
		writer.Header().Set("Server", "CloudFlare")
		writer.Header().Set("CF-Ray", "test-ray-FRA")
		writer.Header().Set("Location", canonicalHTTPSURL)
		if alter != nil {
			alter(writer, request, false)
		}
		if writer.Header().Get("Location") != "" {
			writer.WriteHeader(http.StatusMovedPermanently)
		}
	}))
	t.Cleanup(httpServer.Close)

	dialer := &net.Dialer{}
	transport := &http.Transport{
		Proxy: nil,
		DialContext: func(ctx context.Context, network, address string) (net.Conn, error) {
			host, port, err := net.SplitHostPort(address)
			if err != nil || !strings.EqualFold(host, "www.cordana.dev") {
				return nil, fmt.Errorf("unexpected test dial address %q", address)
			}
			target := ""
			switch port {
			case "80":
				target = httpServer.Listener.Addr().String()
			case "443":
				target = httpsServer.Listener.Addr().String()
			default:
				return nil, fmt.Errorf("unexpected test dial port %q", port)
			}
			return dialer.DialContext(ctx, network, target)
		},
		TLSClientConfig: &tls.Config{
			MinVersion: tls.VersionTLS12,
			RootCAs:    roots,
			ServerName: "www.cordana.dev",
		},
	}
	manifest := validTestManifest()
	manifest.TimeoutSeconds = 2
	manifest.MinimumCertificateRemainingDays = minimumRemainingDays
	root := t.TempDir()
	writeValidManifest(t, root, manifest)
	clock := leaf.NotBefore.Add(time.Hour)
	return transportFixture{
		root: root, manifest: manifest, client: &http.Client{Transport: transport}, clock: clock,
		httpHits: httpHits, httpsHits: httpsHits, certificate: leaf,
	}
}

func newTestCertificate(t *testing.T, hostname string) (tls.Certificate, *x509.Certificate, *x509.CertPool) {
	t.Helper()
	now := time.Now().UTC().Truncate(time.Second)
	caKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatal(err)
	}
	caTemplate := &x509.Certificate{
		SerialNumber:          big.NewInt(1),
		Subject:               pkix.Name{CommonName: "20w test CA"},
		NotBefore:             now.Add(-time.Hour),
		NotAfter:              now.Add(365 * 24 * time.Hour),
		KeyUsage:              x509.KeyUsageCertSign | x509.KeyUsageDigitalSignature,
		BasicConstraintsValid: true,
		IsCA:                  true,
	}
	caDER, err := x509.CreateCertificate(rand.Reader, caTemplate, caTemplate, &caKey.PublicKey, caKey)
	if err != nil {
		t.Fatal(err)
	}
	ca, err := x509.ParseCertificate(caDER)
	if err != nil {
		t.Fatal(err)
	}
	leafKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatal(err)
	}
	leafTemplate := &x509.Certificate{
		SerialNumber: big.NewInt(2),
		Subject:      pkix.Name{CommonName: hostname},
		DNSNames:     []string{hostname},
		NotBefore:    now.Add(-time.Hour),
		NotAfter:     now.Add(90 * 24 * time.Hour),
		KeyUsage:     x509.KeyUsageDigitalSignature,
		ExtKeyUsage:  []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
	}
	leafDER, err := x509.CreateCertificate(rand.Reader, leafTemplate, ca, &leafKey.PublicKey, caKey)
	if err != nil {
		t.Fatal(err)
	}
	leaf, err := x509.ParseCertificate(leafDER)
	if err != nil {
		t.Fatal(err)
	}
	roots := x509.NewCertPool()
	roots.AddCert(ca)
	return tls.Certificate{
		Certificate: [][]byte{leafDER, caDER},
		PrivateKey:  leafKey,
		Leaf:        leaf,
	}, leaf, roots
}

func TestVerifyAcceptsExactCloudflareBoundaryWithoutFollowingRedirect(t *testing.T) {
	t.Parallel()
	var nonHead atomic.Int32
	fixture := newTransportFixture(t, func(_ http.ResponseWriter, request *http.Request, _ bool) {
		if request.Method != http.MethodHead {
			nonHead.Add(1)
		}
	})
	result, err := Verify(context.Background(), fixture.root, Dependencies{
		Client: fixture.client,
		Clock:  func() time.Time { return fixture.clock },
	})
	if err != nil {
		t.Fatal(err)
	}
	if result.HTTPStatus != 301 || result.HTTPSStatus != 200 || result.RedirectLocation != fixture.manifest.HTTPSURL {
		t.Fatalf("Verify() result = %#v", result)
	}
	if !strings.EqualFold(result.Server, "cloudflare") || result.CertificateNotAfter != fixture.certificate.NotAfter {
		t.Fatalf("Verify() server/certificate = %q/%s", result.Server, result.CertificateNotAfter)
	}
	if fixture.httpHits.Load() != 1 || fixture.httpsHits.Load() != 1 || nonHead.Load() != 0 {
		t.Fatalf("request counts HTTP/HTTPS/non-HEAD = %d/%d/%d", fixture.httpHits.Load(), fixture.httpsHits.Load(), nonHead.Load())
	}
}

func TestVerifyRejectsUntrustedTLS(t *testing.T) {
	t.Parallel()
	fixture := newTransportFixture(t, nil)
	transport := fixture.client.Transport.(*http.Transport).Clone()
	transport.TLSClientConfig = &tls.Config{MinVersion: tls.VersionTLS12, ServerName: "www.cordana.dev"}
	client := &http.Client{Transport: transport}
	_, err := Verify(context.Background(), fixture.root, Dependencies{Client: client})
	if err == nil || !strings.Contains(err.Error(), "verify HTTPS transport") {
		t.Fatalf("Verify() error = %v, want TLS trust failure", err)
	}
}

func TestVerifyRejectsCertificateBelowRemainingThreshold(t *testing.T) {
	t.Parallel()
	fixture := newTransportFixture(t, nil)
	now := fixture.certificate.NotAfter.Add(-(minimumRemainingDays*24*time.Hour - time.Hour))
	_, err := Verify(context.Background(), fixture.root, Dependencies{
		Client: fixture.client,
		Clock:  func() time.Time { return now },
	})
	if err == nil || !strings.Contains(err.Error(), "want at least 336h0m0s") {
		t.Fatalf("Verify() error = %v, want remaining-certificate failure", err)
	}
}

func TestValidateTLSAcceptsExactRemainingThreshold(t *testing.T) {
	t.Parallel()
	fixture := newTransportFixture(t, nil)
	response, err := requestHead(context.Background(), boundedClient(fixture.client, time.Second), fixture.manifest.HTTPSURL)
	if err != nil {
		t.Fatal(err)
	}
	now := fixture.certificate.NotAfter.Add(-minimumRemainingDays * 24 * time.Hour)
	if _, remaining, err := validateTLS(response, now, minimumRemainingDays, "www.cordana.dev"); err != nil || remaining != minimumRemainingDays*24*time.Hour {
		t.Fatalf("validateTLS() remaining/error = %s/%v", remaining, err)
	}
}

func TestValidateTLSRejectsVerifiedLeafForAnotherHostname(t *testing.T) {
	t.Parallel()
	_, leaf, _ := newTestCertificate(t, "wrong.cordana.dev")
	response := &http.Response{TLS: &tls.ConnectionState{
		HandshakeComplete: true,
		Version:           tls.VersionTLS13,
		VerifiedChains:    [][]*x509.Certificate{{leaf}},
	}}
	now := leaf.NotBefore.Add(time.Hour)
	if _, _, err := validateTLS(response, now, 1, "www.cordana.dev"); err == nil ||
		!strings.Contains(err.Error(), "does not match") {
		t.Fatalf("validateTLS() error = %v, want explicit hostname refusal", err)
	}
}

func TestVerifyRejectsResponseContractFailures(t *testing.T) {
	t.Parallel()
	cases := map[string]struct {
		alter func(http.ResponseWriter, *http.Request, bool)
		want  string
	}{
		"HTTP status": {alter: func(writer http.ResponseWriter, _ *http.Request, secure bool) {
			if !secure {
				writer.Header().Del("Location")
				writer.WriteHeader(http.StatusOK)
			}
		}, want: "status = 200"},
		"redirect": {alter: func(writer http.ResponseWriter, _ *http.Request, secure bool) {
			if !secure {
				writer.Header().Set("Location", "https://example.invalid/")
			}
		}, want: "Location values"},
		"duplicate redirect": {alter: func(writer http.ResponseWriter, _ *http.Request, secure bool) {
			if !secure {
				writer.Header().Add("Location", "https://example.invalid/")
			}
		}, want: "Location values"},
		"HTTPS status": {alter: func(writer http.ResponseWriter, _ *http.Request, secure bool) {
			if secure {
				writer.WriteHeader(http.StatusNoContent + 1)
			}
		}, want: "status = 205"},
		"server": {alter: func(writer http.ResponseWriter, _ *http.Request, secure bool) {
			if secure {
				writer.Header().Set("Server", "origin")
			}
		}, want: "Server"},
		"required header": {alter: func(writer http.ResponseWriter, _ *http.Request, secure bool) {
			if secure {
				writer.Header().Del("CF-Ray")
			}
		}, want: "required CF-Ray"},
	}
	for name, testCase := range cases {
		name, testCase := name, testCase
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			fixture := newTransportFixture(t, testCase.alter)
			_, err := Verify(context.Background(), fixture.root, Dependencies{
				Client: fixture.client,
				Clock:  func() time.Time { return fixture.clock },
			})
			if err == nil || !strings.Contains(err.Error(), testCase.want) {
				t.Fatalf("Verify() error = %v, want %q", err, testCase.want)
			}
		})
	}
}

type blockingRoundTripper struct{}

func (blockingRoundTripper) RoundTrip(request *http.Request) (*http.Response, error) {
	<-request.Context().Done()
	return nil, request.Context().Err()
}

func TestVerifyAppliesOneWholeTimeout(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	manifest := validTestManifest()
	manifest.TimeoutSeconds = 1
	writeValidManifest(t, root, manifest)
	started := time.Now()
	_, err := Verify(context.Background(), root, Dependencies{
		Client: &http.Client{Transport: blockingRoundTripper{}},
	})
	elapsed := time.Since(started)
	if err == nil || !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("Verify() error = %v, want deadline", err)
	}
	if elapsed < 900*time.Millisecond || elapsed > 2*time.Second {
		t.Fatalf("Verify() elapsed = %s, want bounded near one second", elapsed)
	}
}
