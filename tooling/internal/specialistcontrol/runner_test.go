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

type verifierFunc func(context.Context, Invocation, Candidate) (Verification, error)

func (function verifierFunc) Verify(ctx context.Context, invocation Invocation, candidate Candidate) (Verification, error) {
	return function(ctx, invocation, candidate)
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
	verifier := verifierFunc(func(_ context.Context, invocation Invocation, result Candidate) (Verification, error) {
		if !slices.Equal(events, []string{"record:" + targetID, "invoke:" + targetID}) {
			t.Fatalf("events before Verify() = %v, want record then invoke", events)
		}
		events = append(events, "verify:"+targetID)
		result.Payload[0] = 'X'
		return Verification{Binding: result.Binding, CandidateBinding: result.CandidateBinding, Verdict: VerificationExact}, nil
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
	admission := testAdmission(t, policy, testNow)
	expectedBinding := bindRequest(boundRequest, targetID, testNow, testAdmissionDecision(policy, request.Task, testNow))
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
	verifier := verifierFunc(func(_ context.Context, invocation Invocation, result Candidate) (Verification, error) {
		if !slices.Equal(invocation.Payload, expectedPayload) {
			t.Fatalf("verifier invocation payload = %q, want fresh canonical %q", invocation.Payload, expectedPayload)
		}
		return Verification{Binding: result.Binding, CandidateBinding: result.CandidateBinding, Verdict: VerificationExact}, nil
	})
	runner, err := NewRunner(
		policy,
		admission,
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
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
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

func TestRunnerRechecksRequestAgeImmediatelyBeforeSpecialistEffect(t *testing.T) {
	t.Parallel()
	limits := testLimits()
	limits.MaxRequestAge = time.Second
	policy := testPolicyWithLimits(t, limits)
	request := testRequest(TaskInsertionSort)
	targetID := "exact-" + string(request.Task)
	invoked := false
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
		invoked = true
		return SpecialistResult{}, nil
	})
	clockCalls := 0
	now := func() time.Time {
		clockCalls++
		if clockCalls >= 3 {
			return testNow.Add(time.Nanosecond)
		}
		return testNow
	}
	var recorded []Decision
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, testNow),
		recorderFunc(func(_ context.Context, decision Decision) error {
			recorded = append(recorded, decision)
			return nil
		}),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
			t.Fatal("verifier ran after request-age expiry")
			return Verification{}, nil
		}),
		now,
	)
	if err != nil {
		t.Fatal(err)
	}

	run, runErr := runner.Run(context.Background(), request)
	if runErr != nil || invoked || len(recorded) != 2 || recorded[0].State != DecisionInvoke ||
		recorded[1].State != DecisionAbstain || recorded[1].Reason != ReasonStaleRequest ||
		recorded[1].Admission.State != AdmissionAdmitted || run.Decision != recorded[1] ||
		run.Outcome.State != OutcomeAbstained || run.Outcome.Reason != ReasonStaleRequest {
		t.Fatalf("Run(request aged during record) = %#v, %v, recorded=%#v invoked=%t", run, runErr, recorded, invoked)
	}
}

func TestRunnerBoundsDecisionRecorderContexts(t *testing.T) {
	t.Parallel()
	limits := testLimits()
	limits.MaxDecisionRecord = 25 * time.Millisecond
	policy := testPolicyWithLimits(t, limits)
	request := testRequest(TaskBinarySearch)
	targetID := "exact-" + string(request.Task)
	invoked := false
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
		invoked = true
		return SpecialistResult{}, nil
	})
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	records := 0
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, testNow),
		recorderFunc(func(recordContext context.Context, _ Decision) error {
			records++
			deadline, present := recordContext.Deadline()
			remaining := time.Until(deadline)
			if !present || remaining <= 0 || remaining > limits.MaxDecisionRecord+10*time.Millisecond {
				t.Fatalf("record context %d deadline = %s/%t", records, remaining, present)
			}
			if records == 1 {
				cancel()
				return nil
			}
			if recordContext.Err() != nil {
				t.Fatalf("detached terminal record context error = %v", recordContext.Err())
			}
			return nil
		}),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
			t.Fatal("verifier ran after recorder-triggered cancellation")
			return Verification{}, nil
		}),
		fixedClock(testNow),
	)
	if err != nil {
		t.Fatal(err)
	}
	if budget := runner.decisionRecordBudget(Decision{
		DecidedAt: testNow, Deadline: testNow.Add(5 * time.Millisecond),
	}); budget != 5*time.Millisecond {
		t.Fatalf("decisionRecordBudget() = %s, want request-bound 5ms", budget)
	}

	run, runErr := runner.Run(ctx, request)
	if !errors.Is(runErr, context.Canceled) || invoked || records != 2 ||
		run.Decision.State != DecisionAbstain || run.Decision.Reason != ReasonCancelled {
		t.Fatalf("Run(cancelled after bounded record) = %#v, %v, invoked=%t records=%d", run, runErr, invoked, records)
	}
}

func TestRunnerDurablyRecordsPreCancelledAdmissionWithDetachedBound(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	records := 0
	recorded := false
	specialists := testSpecialists(policy)
	for specialistID := range specialists {
		specialists[specialistID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
			t.Fatal("specialist ran for pre-cancelled admission")
			return SpecialistResult{}, nil
		})
	}
	runner := testRunner(
		t,
		policy,
		recorderFunc(func(recordContext context.Context, decision Decision) error {
			records++
			if err := recordContext.Err(); err != nil {
				return err
			}
			deadline, present := recordContext.Deadline()
			remaining := time.Until(deadline)
			if !present || remaining <= 0 || remaining > testLimits().MaxDecisionRecord+10*time.Millisecond {
				t.Fatalf("detached terminal receipt bound = %s/%t", remaining, present)
			}
			if decision.State != DecisionAbstain || decision.Reason != ReasonCancelled ||
				decision.Admission.Reason != AdmissionReasonCancelled {
				t.Fatalf("detached terminal receipt = %#v", decision)
			}
			recorded = true
			return nil
		}),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
			t.Fatal("verifier ran for pre-cancelled admission")
			return Verification{}, nil
		}),
	)

	run, err := runner.Run(ctx, testRequest(TaskInsertionSort))
	if !errors.Is(err, context.Canceled) || records != 1 || !recorded || run.Outcome.Reason != ReasonCancelled {
		t.Fatalf("Run(pre-cancelled) = %#v, %v, records=%d recorded=%t", run, err, records, recorded)
	}
}

func TestRunnerGivesNearDeadlineCancellationACompleteDetachedRecordBudget(t *testing.T) {
	limits := testLimits()
	limits.MaxRequestAge = time.Second
	limits.MaxExecution = 500 * time.Millisecond
	limits.MaxDecisionRecord = 300 * time.Millisecond
	policy := testPolicyWithLimits(t, limits)
	issuedAt := time.Now()
	request := testRequest(TaskInsertionSort)
	request.IssuedAt = issuedAt
	request.Deadline = issuedAt.Add(100 * time.Millisecond)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	recorded := false
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, issuedAt),
		recorderFunc(func(recordContext context.Context, decision Decision) error {
			recordDeadline, present := recordContext.Deadline()
			if !present || !recordDeadline.After(request.Deadline) {
				return errors.New("detached record budget ended at the request deadline")
			}
			timer := time.NewTimer(time.Until(request.Deadline.Add(20 * time.Millisecond)))
			defer timer.Stop()
			select {
			case <-recordContext.Done():
				return recordContext.Err()
			case <-timer.C:
			}
			if decision.State != DecisionAbstain || decision.Reason != ReasonCancelled {
				return errors.New("detached record lost the cancellation decision")
			}
			recorded = true
			return nil
		}),
		testSpecialists(policy),
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
			t.Fatal("verifier ran for pre-cancelled request")
			return Verification{}, nil
		}),
		time.Now,
	)
	if err != nil {
		t.Fatal(err)
	}

	run, runErr := runner.Run(ctx, request)
	if !errors.Is(runErr, context.Canceled) || !recorded || run.Decision.Reason != ReasonCancelled {
		t.Fatalf("Run(near-deadline cancellation) = %#v, %v, recorded=%t", run, runErr, recorded)
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
				verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
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

func TestRunnerSnapshotsSpecialistResultBeforeClockCallback(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskBellmanFord)
	targetID := "exact-" + string(request.Task)
	retainedPayload := []byte("answer")
	clockCalls := 0
	now := func() time.Time {
		clockCalls++
		if clockCalls == 4 {
			retainedPayload[0] = 'X'
		}
		return testNow
	}
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
		return SpecialistResult{
			Binding: invocation.Binding, SpecialistID: targetID, State: ResultCompleted, Payload: retainedPayload,
		}, nil
	})
	verifier := verifierFunc(func(_ context.Context, _ Invocation, candidate Candidate) (Verification, error) {
		if string(candidate.Payload) != "answer" || candidate.CandidateBinding != bindCandidate(
			candidate.Binding, targetID, ResultCompleted, []byte("answer"),
		) {
			t.Fatalf("candidate after retained-slice mutation = %#v", candidate)
		}
		return Verification{
			Binding: candidate.Binding, CandidateBinding: candidate.CandidateBinding, Verdict: VerificationExact,
		}, nil
	})
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, testNow),
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifier,
		now,
	)
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}

	run, runErr := runner.Run(context.Background(), request)
	if runErr != nil || string(retainedPayload) != "Xnswer" || string(run.Outcome.Payload) != "answer" ||
		run.Outcome.State != OutcomeVerified {
		t.Fatalf("Run() error/retained/outcome = %v/%q/%#v", runErr, retainedPayload, run.Outcome)
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
				verifierFunc(func(_ context.Context, _ Invocation, result Candidate) (Verification, error) {
					if test.verifier != nil {
						return Verification{}, test.verifier
					}
					return Verification{Binding: result.Binding, CandidateBinding: result.CandidateBinding, Verdict: VerificationExact}, nil
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
		testAdmission(t, policy, request.IssuedAt),
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
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

func TestRunnerDoesNotExtendAbsoluteDeadlineAfterRevalidation(t *testing.T) {
	limits := testLimits()
	limits.MaxRequestAge = time.Second
	limits.MaxExecution = 500 * time.Millisecond
	policy := testPolicyWithLimits(t, limits)
	issuedAt := time.Now()
	request := testRequest(TaskBellmanFord)
	request.IssuedAt = issuedAt
	request.Deadline = issuedAt.Add(200 * time.Millisecond)
	targetID := "exact-" + string(request.Task)
	invoked := false
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
		invoked = true
		return SpecialistResult{}, nil
	})
	clockCalls := 0
	sampledBeforeDeadline := false
	now := func() time.Time {
		clockCalls++
		sampled := time.Now()
		if clockCalls == 3 {
			sampledBeforeDeadline = sampled.Before(request.Deadline)
			if delay := time.Until(request.Deadline.Add(10 * time.Millisecond)); delay > 0 {
				time.Sleep(delay)
			}
		}
		return sampled
	}
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, issuedAt),
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
			t.Fatal("verifier ran after the absolute request deadline")
			return Verification{}, nil
		}),
		now,
	)
	if err != nil {
		t.Fatal(err)
	}

	run, runErr := runner.Run(context.Background(), request)
	if !sampledBeforeDeadline || clockCalls < 3 || invoked ||
		!errors.Is(runErr, context.DeadlineExceeded) || run.Outcome.Reason != ReasonDeadlineElapsed {
		t.Fatalf("Run(delayed revalidation) = %#v, %v, calls=%d sampled-before=%t invoked=%t", run, runErr, clockCalls, sampledBeforeDeadline, invoked)
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
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
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

func TestRunnerRechecksDerivedContextAfterSecondClock(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskBinarySearch)
	targetID := "exact-" + string(request.Task)
	invoked := false
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
		invoked = true
		return SpecialistResult{}, nil
	})
	ctx, cancel := context.WithCancel(context.Background())
	clockCalls := 0
	now := func() time.Time {
		clockCalls++
		if clockCalls == 2 {
			cancel()
		}
		return testNow
	}
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, testNow),
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
			t.Fatal("verifier ran after second-clock cancellation")
			return Verification{}, nil
		}),
		now,
	)
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}

	run, runErr := runner.Run(ctx, request)
	if !errors.Is(runErr, context.Canceled) || invoked ||
		run.Outcome.State != OutcomeAbstained || run.Outcome.Reason != ReasonCancelled {
		t.Fatalf("Run() error/invoked/outcome = %v/%t/%#v, want pre-invocation cancellation", runErr, invoked, run.Outcome)
	}
}

func TestRunnerRefusesSecondClockRollback(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskBinarySearch)
	invoked := false
	specialists := testSpecialists(policy)
	targetID := "exact-" + string(request.Task)
	specialists[targetID] = specialistFunc(func(context.Context, Invocation) (SpecialistResult, error) {
		invoked = true
		return SpecialistResult{}, nil
	})
	clockCalls := 0
	now := func() time.Time {
		clockCalls++
		if clockCalls == 3 {
			return testNow.Add(-time.Nanosecond)
		}
		return testNow
	}
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, testNow),
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
			t.Fatal("verifier ran after clock rollback")
			return Verification{}, nil
		}),
		now,
	)
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}

	run, runErr := runner.Run(context.Background(), request)
	if runErr != nil || invoked || run.Outcome.State != OutcomeRefused || run.Outcome.Reason != ReasonMalformedRequest {
		t.Fatalf("Run() error/invoked/outcome = %v/%t/%#v, want clock-rollback refusal", runErr, invoked, run.Outcome)
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
		if clockCalls == 4 {
			cancel()
		}
		return testNow
	}
	verifierCalled := false
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, testNow),
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
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

func TestRunnerRejectsExactVerificationAfterPolicyDeadline(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskKMPMatcher)
	targetID := "exact-" + string(request.Task)
	specialists := testSpecialists(policy)
	specialists[targetID] = specialistFunc(func(_ context.Context, invocation Invocation) (SpecialistResult, error) {
		return SpecialistResult{
			Binding: invocation.Binding, SpecialistID: targetID, State: ResultCompleted, Payload: []byte("answer"),
		}, nil
	})
	clockCalls := 0
	now := func() time.Time {
		clockCalls++
		if clockCalls == 5 {
			return request.Deadline
		}
		return testNow
	}
	verifierCalled := false
	runner, err := NewRunner(
		policy,
		testAdmission(t, policy, testNow),
		recorderFunc(func(context.Context, Decision) error { return nil }),
		specialists,
		verifierFunc(func(_ context.Context, _ Invocation, candidate Candidate) (Verification, error) {
			verifierCalled = true
			return Verification{
				Binding: candidate.Binding, CandidateBinding: candidate.CandidateBinding, Verdict: VerificationExact,
			}, nil
		}),
		now,
	)
	if err != nil {
		t.Fatalf("NewRunner() error = %v", err)
	}

	run, runErr := runner.Run(context.Background(), request)
	if runErr != nil || !verifierCalled || run.Outcome.State != OutcomeAbstained ||
		run.Outcome.Reason != ReasonDeadlineElapsed || len(run.Outcome.Payload) != 0 {
		t.Fatalf("Run() error/verifier/outcome = %v/%t/%#v, want terminal deadline abstention", runErr, verifierCalled, run.Outcome)
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
		verifierFunc(func(context.Context, Invocation, Candidate) (Verification, error) {
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
	runner, err := NewRunner(
		policy, testAdmission(t, policy, testNow), recorder, specialists, verifier,
		func() time.Time { return testNow },
	)
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

func testAdmission(t *testing.T, policy Policy, at time.Time) *Admission {
	t.Helper()
	observations := make([]ReadinessObservation, 0, len(policy.specialistIDs()))
	for task, specialistIDs := range policy.routes {
		for _, specialistID := range specialistIDs {
			observations = append(observations, ReadinessObservation{
				SpecialistID: specialistID, State: ReadinessReady,
				ObservedAt: at.Add(-time.Second), ValidFor: time.Minute,
				Fits: []RequestFit{{Task: task, State: FitTaskCompatible}},
			})
		}
	}
	admission, err := NewAdmission(policy, AdmissionLimits{
		MaxObservationValidity: time.Minute, MaxQueueDepth: 8, MaxWait: time.Second,
		MaxRetries: 2, MaxConcurrencyPerSpecialist: 1, MaxTotalPending: 48, MaxTotalActive: 6,
	}, observations, at)
	if err != nil {
		t.Fatalf("NewAdmission() error = %v", err)
	}
	return admission
}
