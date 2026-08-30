package specialistcontrol

import (
	"context"
	"errors"
	"slices"
	"testing"
	"time"
)

type recorderFunc func(context.Context, Decision) error

func (function recorderFunc) RecordDecision(ctx context.Context, decision Decision) error {
	return function(ctx, decision)
}

type specialistFunc func(context.Context, Invocation) (SpecialistResult, error)

func (function specialistFunc) Invoke(ctx context.Context, invocation Invocation) (SpecialistResult, error) {
	return function(ctx, invocation)
}

type verifierFunc func(context.Context, Invocation, SpecialistResult) (Verification, error)

func (function verifierFunc) Verify(ctx context.Context, invocation Invocation, result SpecialistResult) (Verification, error) {
	return function(ctx, invocation, result)
}

func TestRunnerRecordsDecisionBeforeSpecialistAndVerifierEffects(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskInsertionSort)
	events := make([]string, 0, 3)
	recorder := recorderFunc(func(_ context.Context, decision Decision) error {
		events = append(events, "record:"+decision.SpecialistID)
		return nil
	})
	targetID := "exact-" + string(request.Task)
	specialistPayload := []byte("[1,2,3]")
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
		if !slices.Equal(events, []string{"record:" + targetID}) {
			t.Fatalf("events before Invoke() = %v, want recorded decision", events)
		}
		if invocation.MaxResultBytes != testLimits().MaxResultBytes || invocation.Binding == (Binding{}) {
			t.Fatalf("Invocation bounds/identity = %#v", invocation)
		}
		events = append(events, "invoke:"+targetID)
		invocation.Payload[0] = 'X'
		return SpecialistResult{
			Binding:      invocation.Binding,
			SpecialistID: targetID,
			State:        ResultCompleted,
			Payload:      specialistPayload,
		}, nil
	})
	verifier := verifierFunc(func(_ context.Context, invocation Invocation, result SpecialistResult) (Verification, error) {
		if !slices.Equal(events, []string{"record:" + targetID, "invoke:" + targetID}) {
			t.Fatalf("events before Verify() = %v, want record then invoke", events)
		}
		events = append(events, "verify:"+targetID)
		result.Payload[0] = 'X'
		return Verification{Binding: result.Binding, Verdict: VerificationExact}, nil
	})
	runner := testRunner(t, policy, recorder, specialists, verifier)
	originalPayload := append([]byte(nil), request.Payload...)

	run, err := runner.Run(context.Background(), request)
	if err != nil {
		t.Fatalf("Run() error = %v", err)
	}
	if !slices.Equal(events, []string{"record:" + targetID, "invoke:" + targetID, "verify:" + targetID}) {
		t.Fatalf("effect order = %v", events)
	}
	if run.Outcome.State != OutcomeVerified || run.Outcome.Authority != ResultAuthority {
		t.Fatalf("Run() outcome = %#v, want verified NO_RESULT construction output", run.Outcome)
	}
	if !slices.Equal(request.Payload, originalPayload) {
		t.Fatalf("specialist mutated caller request: %q", request.Payload)
	}
	if string(specialistPayload) != "[1,2,3]" || string(run.Outcome.Payload) != "[1,2,3]" {
		t.Fatalf("verifier received an unnormalised alias: specialist/outcome = %q/%q", specialistPayload, run.Outcome.Payload)
	}
}

func TestRunnerSnapshotsRequestBeforeClockOrCallerAliasMutation(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskInsertionSort)
	expectedPayload := append([]byte(nil), request.Payload...)
	boundRequest := request
	boundRequest.Payload = append([]byte(nil), expectedPayload...)
	targetID := "exact-" + string(request.Task)
	expectedBinding := bindRequest(boundRequest, targetID)
	clockCalls := 0
	now := func() time.Time {
		clockCalls++
		if clockCalls == 1 {
			request.Payload[0] = 'X'
		}
		return testNow
	}
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
		if !slices.Equal(invocation.Payload, expectedPayload) || invocation.Binding != expectedBinding {
			t.Fatalf("specialist invocation payload/binding = %q/%x, want snapshotted %q/%x", invocation.Payload, invocation.Binding, expectedPayload, expectedBinding)
		}
		invocation.Payload[0] = 'Y'
		return SpecialistResult{Binding: invocation.Binding, SpecialistID: targetID, State: ResultCompleted, Payload: []byte("answer")}, nil
	})
	verifier := verifierFunc(func(_ context.Context, invocation Invocation, result SpecialistResult) (Verification, error) {
		if !slices.Equal(invocation.Payload, expectedPayload) {
			t.Fatalf("verifier invocation payload = %q, want fresh canonical %q", invocation.Payload, expectedPayload)
		}
		return Verification{Binding: result.Binding, Verdict: VerificationExact}, nil
	})
	runner, err := NewRunner(
		policy,
		recorderFunc(func(_ context.Context, decision Decision) error {
			if decision.Binding != expectedBinding {
				t.Fatalf("recorded binding = %x, want %x", decision.Binding, expectedBinding)
			}
			return nil
		}),
		specialists,
		verifier,
		now,
	)
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}

	run, runErr := runner.Run(context.Background(), request)
	if runErr != nil || request.Payload[0] != 'X' || run.Outcome.State != OutcomeVerified || run.Outcome.Binding != expectedBinding {
		t.Fatalf("Run() error/caller/outcome = %v/%q/%#v", runErr, request.Payload, run.Outcome)
	}
}

func TestRunnerRecorderFailurePreventsSpecialistEffects(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	invoked := false
	specialists := testSpecialists(policy)
	targetID := "exact-" + string(TaskBinarySearch)
	specialists[targetID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
		invoked = true
		return SpecialistResult{}, nil
	})
	runner := testRunner(
		t,
		policy,
		recorderFunc(func(context.Context, Decision) error { return errors.New("closed recorder") }),
		specialists,
		verifierFunc(func(context.Context, Invocation, SpecialistResult) (Verification, error) {
			t.Fatal("verifier ran after recorder failure")
			return Verification{}, nil
		}),
	)

	run, err := runner.Run(context.Background(), testRequest(TaskBinarySearch))
	if err == nil || invoked {
		t.Fatalf("Run() error/invoked = %v/%t, want error and no specialist effect", err, invoked)
	}
	if run.Decision.State != DecisionInvoke || run.Outcome.Authority != ResultAuthority {
		t.Fatalf("Run() retained state = %#v", run)
	}
}

func TestRunnerSkipsVerifierForUnsafeOrAbstainedResults(t *testing.T) {
	t.Parallel()
	for name, result := range map[string]SpecialistResult{
		"oversized": {State: ResultCompleted, Payload: []byte("0123456789abcdef0")},
		"abstained": {State: ResultAbstained},
	} {
		name, result := name, result
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			policy := testPolicy(t)
			request := testRequest(TaskMatrixChainOrder)
			targetID := "exact-" + string(request.Task)
			specialists := testSpecialists(policy)
			specialists[targetID] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
				result.Binding = invocation.Binding
				result.SpecialistID = targetID
				return result, nil
			})
			verifierCalled := false
			runner := testRunner(
				t,
				policy,
				recorderFunc(func(context.Context, Decision) error { return nil }),
				specialists,
				verifierFunc(func(context.Context, Invocation, SpecialistResult) (Verification, error) {
					verifierCalled = true
					return Verification{}, nil
				}),
			)

			run, err := runner.Run(context.Background(), request)
			if err != nil || verifierCalled || run.Outcome.State == OutcomeVerified {
				t.Fatalf("Run() error/verifier/outcome = %v/%t/%#v", err, verifierCalled, run.Outcome)
			}
		})
	}
}

func TestRunnerTypesSpecialistAndVerifierFailuresAsAbstentions(t *testing.T) {
	t.Parallel()
	for name, test := range map[string]struct {
		specialist error
		verifier   error
		reason     Reason
	}{
		"specialist": {specialist: errors.New("solver failed"), reason: ReasonSpecialistFailed},
		"verifier":   {verifier: errors.New("scorer failed"), reason: ReasonVerificationFailed},
	} {
		name, test := name, test
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			policy := testPolicy(t)
			request := testRequest(TaskKMPMatcher)
			targetID := "exact-" + string(request.Task)
			specialists := testSpecialists(policy)
			specialists[targetID] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
				if test.specialist != nil {
					return SpecialistResult{}, test.specialist
				}
				return SpecialistResult{Binding: invocation.Binding, SpecialistID: targetID, State: ResultCompleted, Payload: []byte("3")}, nil
			})
			runner := testRunner(
				t,
				policy,
				recorderFunc(func(context.Context, Decision) error { return nil }),
				specialists,
				verifierFunc(func(_ context.Context, _ Invocation, result SpecialistResult) (Verification, error) {
					if test.verifier != nil {
						return Verification{}, test.verifier
					}
					return Verification{Binding: result.Binding, Verdict: VerificationExact}, nil
				}),
			)

			run, err := runner.Run(context.Background(), request)
			if err == nil || run.Outcome.State != OutcomeAbstained || run.Outcome.Reason != test.reason {
				t.Fatalf("Run() error/outcome = %v/%#v, want typed %s abstention", err, run.Outcome, test.reason)
			}
		})
	}
}

func TestRunnerEnforcesLiveExecutionDeadline(t *testing.T) {
	t.Parallel()
	limits := testLimits()
	limits.MaxRequestAge = time.Second
	limits.MaxExecution = 500 * time.Millisecond
	policy := testPolicyWithLimits(t, limits)
	request := testRequest(TaskBellmanFord)
	request.IssuedAt = time.Now()
	request.Deadline = request.IssuedAt.Add(250 * time.Millisecond)
	targetID := "exact-" + string(request.Task)
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(ctx context.Context, _ Invocation) (SpecialistResult, error) {
		<-ctx.Done()
		return SpecialistResult{}, ctx.Err()
	})
	runner, err := NewRunner(
		policy,
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(context.Context, Invocation, SpecialistResult) (Verification, error) {
			t.Fatal("verifier ran after execution deadline")
			return Verification{}, nil
		}),
		time.Now,
	)
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}

	run, runErr := runner.Run(context.Background(), request)
	if !errors.Is(runErr, context.DeadlineExceeded) || run.Outcome.State != OutcomeAbstained ||
		run.Outcome.Reason != ReasonDeadlineElapsed {
		t.Fatalf("Run() error/outcome = %v/%#v, want deadline abstention", runErr, run.Outcome)
	}
}

func TestRunnerDistinguishesParentCancellation(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskBinarySearch)
	targetID := "exact-" + string(request.Task)
	recorded := false
	invoked := false
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
		invoked = true
		return SpecialistResult{}, nil
	})
	runner := testRunner(
		t,
		policy,
		recorderFunc(func(context.Context, Decision) error {
			recorded = true
			return nil
		}),
		specialists,
		verifierFunc(func(context.Context, Invocation, SpecialistResult) (Verification, error) {
			t.Fatal("verifier ran after parent cancellation")
			return Verification{}, nil
		}),
	)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	run, err := runner.Run(ctx, request)
	if !errors.Is(err, context.Canceled) || !recorded || invoked ||
		run.Outcome.State != OutcomeAbstained || run.Outcome.Reason != ReasonCancelled {
		t.Fatalf("Run() error/recorded/invoked/outcome = %v/%t/%t/%#v, want recorded cancellation without invocation", err, recorded, invoked, run.Outcome)
	}
}

func TestRunnerRechecksContextBeforeVerifierEffect(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskMatrixChainOrder)
	targetID := "exact-" + string(request.Task)
	specialists := testSpecialists(policy)
	specialistCalled := false
	specialists[targetID] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
		specialistCalled = true
		return SpecialistResult{Binding: invocation.Binding, SpecialistID: targetID, State: ResultCompleted, Payload: []byte("answer")}, nil
	})
	ctx, cancel := context.WithCancel(context.Background())
	clockCalls := 0
	now := func() time.Time {
		clockCalls++
		if clockCalls == 3 {
			cancel()
		}
		return testNow
	}
	verifierCalled := false
	runner, err := NewRunner(
		policy,
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(context.Context, Invocation, SpecialistResult) (Verification, error) {
			verifierCalled = true
			return Verification{}, nil
		}),
		now,
	)
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}

	run, runErr := runner.Run(ctx, request)
	if !errors.Is(runErr, context.Canceled) || !specialistCalled || verifierCalled ||
		run.Outcome.State != OutcomeAbstained || run.Outcome.Reason != ReasonCancelled {
		t.Fatalf("Run() error/specialist/verifier/outcome = %v/%t/%t/%#v", runErr, specialistCalled, verifierCalled, run.Outcome)
	}
}

func TestRunnerRecordsTerminalPolicyDecisionWithoutInvoking(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	recorded := false
	invoked := false
	specialists := testSpecialists(policy)
	for specialistID := range specialists {
		specialists[specialistID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
			invoked = true
			return SpecialistResult{}, nil
		})
	}
	runner := testRunner(
		t,
		policy,
		recorderFunc(func(_ context.Context, decision Decision) error {
			recorded = decision.State == DecisionRefuse
			return nil
		}),
		specialists,
		verifierFunc(func(context.Context, Invocation, SpecialistResult) (Verification, error) {
			t.Fatal("verifier ran for refused request")
			return Verification{}, nil
		}),
	)
	request := testRequest(TaskSegmentsIntersect)
	request.Payload = nil

	run, err := runner.Run(context.Background(), request)
	if err != nil || !recorded || invoked || run.Outcome.State != OutcomeRefused {
		t.Fatalf("Run() error/recorded/invoked/outcome = %v/%t/%t/%#v", err, recorded, invoked, run.Outcome)
	}
}

func testRunner(
	t *testing.T,
	policy Policy,
	recorder DecisionRecorder,
	specialists map[string]Specialist,
	verifier ExactVerifier,
) Runner {
	t.Helper()
	runner, err := NewRunner(policy, recorder, specialists, verifier, func() time.Time { return testNow })
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}
	return runner
}

func testSpecialists(policy Policy) map[string]Specialist {
	specialists := make(map[string]Specialist, len(policy.routes))
	for _, specialistID := range policy.specialistIDs() {
		identity := specialistID
		specialists[identity] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
			return SpecialistResult{Binding: invocation.Binding, SpecialistID: identity, State: ResultAbstained}, nil
		})
	}
	return specialists
}
