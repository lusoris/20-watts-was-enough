// Package githubapi provides the bounded HTTP behavior shared by GitHub API
// commands.
package githubapi

import (
	"context"
	"io"
	"net/http"
	"time"
)

const (
	maximumAttempts       = 3
	maximumRetryDrainSize = 32 << 10
	firstRetryDelay       = 100 * time.Millisecond
	secondRetryDelay      = 300 * time.Millisecond
)

// HTTPClient is the smallest transport surface required by GitHub API calls.
type HTTPClient interface {
	Do(*http.Request) (*http.Response, error)
}

type waitFunc func(context.Context, time.Duration) error

type readRetryClient struct {
	client HTTPClient
	wait   waitFunc
}

// NewReadRetryClient adds bounded transient retries to bodyless GET requests.
// Requests with a body and mutation methods always pass through exactly once.
func NewReadRetryClient(client HTTPClient) HTTPClient {
	return newReadRetryClient(client, waitForRetry)
}

func newReadRetryClient(client HTTPClient, wait waitFunc) HTTPClient {
	if client == nil {
		panic("githubapi: nil HTTP client")
	}
	if wait == nil {
		panic("githubapi: nil retry waiter")
	}
	return &readRetryClient{client: client, wait: wait}
}

func (client *readRetryClient) Do(request *http.Request) (*http.Response, error) {
	if !isRetryableRead(request) {
		return client.client.Do(request)
	}

	for attempt := 0; attempt < maximumAttempts; attempt++ {
		if err := request.Context().Err(); err != nil {
			return nil, err
		}

		response, err := client.client.Do(request)
		if !isRetryable(response, err) || attempt == maximumAttempts-1 {
			return response, err
		}

		discardIntermediateResponse(response)
		if err := client.wait(request.Context(), retryDelay(attempt)); err != nil {
			return nil, err
		}
	}

	panic("unreachable")
}

func isRetryableRead(request *http.Request) bool {
	if request == nil || (request.Method != "" && request.Method != http.MethodGet) {
		return false
	}
	return request.Body == nil || request.Body == http.NoBody
}

func isRetryable(response *http.Response, err error) bool {
	if err != nil {
		// A non-nil response paired with an error is a client-policy failure
		// (for example, CheckRedirect), not a transient transport failure.
		return response == nil
	}
	if response == nil {
		return false
	}
	switch response.StatusCode {
	case http.StatusInternalServerError,
		http.StatusBadGateway,
		http.StatusServiceUnavailable,
		http.StatusGatewayTimeout:
		return true
	default:
		return false
	}
}

func retryDelay(attempt int) time.Duration {
	if attempt == 0 {
		return firstRetryDelay
	}
	return secondRetryDelay
}

func discardIntermediateResponse(response *http.Response) {
	if response == nil || response.Body == nil {
		return
	}
	_, _ = io.Copy(io.Discard, io.LimitReader(response.Body, maximumRetryDrainSize))
	_ = response.Body.Close()
}

func waitForRetry(ctx context.Context, delay time.Duration) error {
	timer := time.NewTimer(delay)
	defer timer.Stop()
	select {
	case <-timer.C:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}
