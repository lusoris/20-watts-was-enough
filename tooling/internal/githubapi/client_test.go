package githubapi

import (
	"bytes"
	"context"
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"
)

type doFunc func(*http.Request) (*http.Response, error)

func (function doFunc) Do(request *http.Request) (*http.Response, error) {
	return function(request)
}

type observedBody struct {
	reader *bytes.Reader
	read   int
	closed bool
}

func newObservedBody(contents []byte) *observedBody {
	return &observedBody{reader: bytes.NewReader(contents)}
}

func (body *observedBody) Read(destination []byte) (int, error) {
	count, err := body.reader.Read(destination)
	body.read += count
	return count, err
}

func (body *observedBody) Close() error {
	body.closed = true
	return nil
}

func response(status int, body io.ReadCloser) *http.Response {
	return &http.Response{StatusCode: status, Body: body, Header: make(http.Header)}
}

func immediateWait(delays *[]time.Duration) waitFunc {
	return func(_ context.Context, delay time.Duration) error {
		*delays = append(*delays, delay)
		return nil
	}
}

func TestReadRetryClientRecoversFromTransientStatuses(t *testing.T) {
	t.Parallel()
	statuses := []int{
		http.StatusInternalServerError,
		http.StatusBadGateway,
		http.StatusServiceUnavailable,
		http.StatusGatewayTimeout,
	}
	for _, status := range statuses {
		status := status
		t.Run(http.StatusText(status), func(t *testing.T) {
			t.Parallel()
			attempts := 0
			transientBody := newObservedBody([]byte("temporary"))
			underlying := doFunc(func(*http.Request) (*http.Response, error) {
				attempts++
				if attempts == 1 {
					return response(status, transientBody), nil
				}
				return response(http.StatusOK, io.NopCloser(strings.NewReader("ready"))), nil
			})
			var delays []time.Duration
			client := newReadRetryClient(underlying, immediateWait(&delays))
			request, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "https://api.github.test/resource", nil)
			if err != nil {
				t.Fatal(err)
			}

			got, err := client.Do(request)
			if err != nil {
				t.Fatal(err)
			}
			defer got.Body.Close()
			if attempts != 2 || got.StatusCode != http.StatusOK {
				t.Fatalf("attempts/status = %d/%d, want 2/200", attempts, got.StatusCode)
			}
			if !transientBody.closed || transientBody.read != len("temporary") {
				t.Fatalf("intermediate body closed/read = %t/%d", transientBody.closed, transientBody.read)
			}
			if len(delays) != 1 || delays[0] != firstRetryDelay {
				t.Fatalf("retry delays = %v, want [%s]", delays, firstRetryDelay)
			}
		})
	}
}

func TestReadRetryClientLeavesFinalTransientResponseIntact(t *testing.T) {
	t.Parallel()
	largeContents := bytes.Repeat([]byte("x"), maximumRetryDrainSize+17)
	bodies := []*observedBody{
		newObservedBody(largeContents),
		newObservedBody([]byte("second temporary response")),
		newObservedBody([]byte("final response body")),
	}
	attempts := 0
	underlying := doFunc(func(*http.Request) (*http.Response, error) {
		body := bodies[attempts]
		attempts++
		return response(http.StatusServiceUnavailable, body), nil
	})
	var delays []time.Duration
	client := newReadRetryClient(underlying, immediateWait(&delays))
	request, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "https://api.github.test/resource", nil)
	if err != nil {
		t.Fatal(err)
	}

	got, err := client.Do(request)
	if err != nil {
		t.Fatal(err)
	}
	defer got.Body.Close()
	if attempts != maximumAttempts || got.Body != bodies[2] {
		t.Fatalf("attempts/final body = %d/%p, want %d/%p", attempts, got.Body, maximumAttempts, bodies[2])
	}
	if !bodies[0].closed || bodies[0].read != maximumRetryDrainSize {
		t.Fatalf("large intermediate body closed/read = %t/%d", bodies[0].closed, bodies[0].read)
	}
	if !bodies[1].closed || bodies[1].read != len("second temporary response") {
		t.Fatalf("second intermediate body closed/read = %t/%d", bodies[1].closed, bodies[1].read)
	}
	if bodies[2].closed || bodies[2].read != 0 {
		t.Fatalf("final body closed/read before caller = %t/%d", bodies[2].closed, bodies[2].read)
	}
	contents, err := io.ReadAll(got.Body)
	if err != nil {
		t.Fatal(err)
	}
	if string(contents) != "final response body" {
		t.Fatalf("final body = %q", contents)
	}
	if len(delays) != 2 || delays[0] != firstRetryDelay || delays[1] != secondRetryDelay {
		t.Fatalf("retry delays = %v, want [%s %s]", delays, firstRetryDelay, secondRetryDelay)
	}
}

func TestReadRetryClientReturnsFinalTransportErrorAtAttemptLimit(t *testing.T) {
	t.Parallel()
	attempts := 0
	finalErr := errors.New("final transport failure")
	underlying := doFunc(func(*http.Request) (*http.Response, error) {
		attempts++
		if attempts == maximumAttempts {
			return nil, finalErr
		}
		return nil, errors.New("temporary transport failure")
	})
	var delays []time.Duration
	client := newReadRetryClient(underlying, immediateWait(&delays))
	request, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "https://api.github.test/resource", nil)
	if err != nil {
		t.Fatal(err)
	}

	got, err := client.Do(request)
	if !errors.Is(err, finalErr) {
		t.Fatalf("Do() error = %v, want final transport error", err)
	}
	if got != nil || attempts != maximumAttempts {
		t.Fatalf("response/attempts = %v/%d, want nil/%d", got, attempts, maximumAttempts)
	}
	if len(delays) != 2 || delays[0] != firstRetryDelay || delays[1] != secondRetryDelay {
		t.Fatalf("retry delays = %v, want [%s %s]", delays, firstRetryDelay, secondRetryDelay)
	}
}

func TestReadRetryClientDoesNotRetryGETWithBody(t *testing.T) {
	t.Parallel()
	attempts := 0
	responseBody := newObservedBody([]byte("do not retry"))
	underlying := doFunc(func(*http.Request) (*http.Response, error) {
		attempts++
		return response(http.StatusServiceUnavailable, responseBody), nil
	})
	client := newReadRetryClient(underlying, func(context.Context, time.Duration) error {
		t.Fatal("GET request with a body invoked retry waiter")
		return nil
	})
	request, err := http.NewRequestWithContext(
		context.Background(), http.MethodGet, "https://api.github.test/resource", strings.NewReader("query"),
	)
	if err != nil {
		t.Fatal(err)
	}

	got, err := client.Do(request)
	if err != nil {
		t.Fatal(err)
	}
	if attempts != 1 || got.Body != responseBody {
		t.Fatalf("attempts/body = %d/%p, want 1/%p", attempts, got.Body, responseBody)
	}
	if responseBody.closed || responseBody.read != 0 {
		t.Fatalf("response body closed/read = %t/%d", responseBody.closed, responseBody.read)
	}
	_ = got.Body.Close()
}

func TestReadRetryClientRecoversFromTransportError(t *testing.T) {
	t.Parallel()
	attempts := 0
	underlying := doFunc(func(*http.Request) (*http.Response, error) {
		attempts++
		if attempts == 1 {
			return nil, errors.New("temporary transport failure")
		}
		return response(http.StatusOK, io.NopCloser(strings.NewReader("ready"))), nil
	})
	var delays []time.Duration
	client := newReadRetryClient(underlying, immediateWait(&delays))
	request, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "https://api.github.test/resource", nil)
	if err != nil {
		t.Fatal(err)
	}

	got, err := client.Do(request)
	if err != nil {
		t.Fatal(err)
	}
	defer got.Body.Close()
	if attempts != 2 || got.StatusCode != http.StatusOK {
		t.Fatalf("attempts/status = %d/%d, want 2/200", attempts, got.StatusCode)
	}
	if len(delays) != 1 || delays[0] != firstRetryDelay {
		t.Fatalf("retry delays = %v, want [%s]", delays, firstRetryDelay)
	}
}

func TestReadRetryClientDoesNotRetryClientPolicyError(t *testing.T) {
	t.Parallel()
	attempts := 0
	policyErr := errors.New("redirect rejected by policy")
	responseBody := newObservedBody([]byte("policy response"))
	wantResponse := response(http.StatusFound, responseBody)
	underlying := doFunc(func(*http.Request) (*http.Response, error) {
		attempts++
		return wantResponse, policyErr
	})
	client := newReadRetryClient(underlying, func(context.Context, time.Duration) error {
		t.Fatal("client policy error invoked retry waiter")
		return nil
	})
	request, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "https://api.github.test/resource", nil)
	if err != nil {
		t.Fatal(err)
	}

	gotResponse, gotErr := client.Do(request)
	if gotResponse != wantResponse || !errors.Is(gotErr, policyErr) {
		t.Fatalf("response/error = %p/%v, want %p/%v", gotResponse, gotErr, wantResponse, policyErr)
	}
	if attempts != 1 {
		t.Fatalf("attempts = %d, want 1", attempts)
	}
	if responseBody.closed || responseBody.read != 0 {
		t.Fatalf("policy response body closed/read = %t/%d", responseBody.closed, responseBody.read)
	}
}

func TestReadRetryClientDoesNotRetryMutationMethods(t *testing.T) {
	t.Parallel()
	methods := []string{http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete}
	for _, method := range methods {
		method := method
		t.Run(method, func(t *testing.T) {
			t.Parallel()
			attempts := 0
			body := newObservedBody([]byte("do not retry"))
			underlying := doFunc(func(*http.Request) (*http.Response, error) {
				attempts++
				return response(http.StatusServiceUnavailable, body), nil
			})
			client := newReadRetryClient(underlying, func(context.Context, time.Duration) error {
				t.Fatal("mutation request invoked retry waiter")
				return nil
			})
			request, err := http.NewRequestWithContext(context.Background(), method, "https://api.github.test/resource", nil)
			if err != nil {
				t.Fatal(err)
			}

			got, err := client.Do(request)
			if err != nil {
				t.Fatal(err)
			}
			if attempts != 1 || got.Body != body {
				t.Fatalf("attempts/body = %d/%p, want 1/%p", attempts, got.Body, body)
			}
			if body.closed || body.read != 0 {
				t.Fatalf("mutation response body closed/read = %t/%d", body.closed, body.read)
			}
			_ = got.Body.Close()
		})
	}
}

func TestReadRetryClientStopsWhenContextIsCancelled(t *testing.T) {
	t.Parallel()
	ctx, cancel := context.WithCancel(context.Background())
	attempts := 0
	body := newObservedBody([]byte("temporary"))
	underlying := doFunc(func(*http.Request) (*http.Response, error) {
		attempts++
		cancel()
		return response(http.StatusGatewayTimeout, body), nil
	})
	client := NewReadRetryClient(underlying)
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.github.test/resource", nil)
	if err != nil {
		t.Fatal(err)
	}

	got, err := client.Do(request)
	if !errors.Is(err, context.Canceled) {
		t.Fatalf("Do() error = %v, want context cancellation", err)
	}
	if got != nil || attempts != 1 {
		t.Fatalf("response/attempts = %v/%d, want nil/1", got, attempts)
	}
	if !body.closed || body.read != len("temporary") {
		t.Fatalf("cancelled intermediate body closed/read = %t/%d", body.closed, body.read)
	}
}
