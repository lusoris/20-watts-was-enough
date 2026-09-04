package pdftools

import (
	"context"
	"crypto/tls"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type exactSource struct {
	Name   string
	URL    string
	Size   int64
	SHA256 string
}

type sourceFetcher func(context.Context, exactSource) ([]byte, error)

type candidateDownloader struct {
	client    *http.Client
	transport *http.Transport
}

func newCandidateDownloader(timeout time.Duration) (candidateDownloader, error) {
	if timeout <= 0 {
		return candidateDownloader{}, errors.New("candidate source download timeout must be positive")
	}
	transport := http.DefaultTransport.(*http.Transport).Clone()
	transport.Proxy = nil
	transport.DisableCompression = true
	transport.MaxIdleConns = 2
	transport.MaxIdleConnsPerHost = 1
	transport.MaxConnsPerHost = 1
	transport.IdleConnTimeout = 30 * time.Second
	transport.ResponseHeaderTimeout = 30 * time.Second
	transport.ExpectContinueTimeout = time.Second
	transport.TLSHandshakeTimeout = 15 * time.Second
	transport.MaxResponseHeaderBytes = 64 * 1024
	transport.DialContext = (&net.Dialer{Timeout: 15 * time.Second, KeepAlive: 30 * time.Second}).DialContext
	transport.TLSClientConfig = &tls.Config{MinVersion: tls.VersionTLS12}
	client := &http.Client{
		Transport: transport,
		Timeout:   timeout,
		CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
			return errors.New("candidate source redirects are not admitted")
		},
	}
	return candidateDownloader{client: client, transport: transport}, nil
}

func (downloader candidateDownloader) close() {
	downloader.transport.CloseIdleConnections()
}

func (downloader candidateDownloader) fetch(ctx context.Context, source exactSource) ([]byte, error) {
	return downloadExactSource(ctx, downloader.client, source)
}

func downloadExactSource(ctx context.Context, client *http.Client, source exactSource) (_ []byte, returnError error) {
	if client == nil {
		return nil, errors.New("candidate source HTTP client is required")
	}
	parsed, err := validateExactSource(source)
	if err != nil {
		return nil, err
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, parsed.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("create %s request: %w", source.Name, err)
	}
	request.Header.Set("Accept-Encoding", "identity")
	request.Header.Set("User-Agent", "20w-pdf-tools-candidate/1")
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("download %s: %w", source.Name, err)
	}
	defer func() {
		returnError = errors.Join(returnError, response.Body.Close())
	}()
	if response.Request == nil || response.Request.URL.String() != source.URL {
		return nil, fmt.Errorf("download %s changed its exact URL", source.Name)
	}
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("download %s returned HTTP status %d", source.Name, response.StatusCode)
	}
	if encoding := response.Header.Get("Content-Encoding"); encoding != "" && encoding != "identity" {
		return nil, fmt.Errorf("download %s returned encoded bytes", source.Name)
	}
	if response.ContentLength >= 0 && response.ContentLength != source.Size {
		return nil, fmt.Errorf("download %s content length differs from its authority", source.Name)
	}
	body, err := io.ReadAll(io.LimitReader(response.Body, source.Size+1))
	if err != nil {
		return nil, fmt.Errorf("read %s: %w", source.Name, err)
	}
	if int64(len(body)) != source.Size || digestRaw(body) != source.SHA256 {
		return nil, fmt.Errorf("download %s differs from its size or SHA-256 authority", source.Name)
	}
	return body, nil
}

func validateExactSource(source exactSource) (*url.URL, error) {
	if source.Name == "" || len(source.Name) > 256 || strings.ContainsAny(source.Name, "\r\n\x00") ||
		source.Size <= 0 || source.Size > 64*1024*1024 || !rawDigestPattern.MatchString(source.SHA256) {
		return nil, errors.New("candidate source identity is invalid")
	}
	parsed, err := url.Parse(source.URL)
	if err != nil || parsed.Scheme != "https" || parsed.Host == "" || parsed.User != nil ||
		parsed.RawPath != "" || parsed.RawQuery != "" || parsed.Fragment != "" {
		return nil, fmt.Errorf("candidate source %s URL is invalid", source.Name)
	}
	return parsed, nil
}
