package specialistcontrol

import (
	"context"
	"errors"
	"fmt"
	"time"
)

// Invocation carries the recorded decision's exact bounds across the effect seam.
type Invocation struct {
	RunID          string
	RequestID      string
	Task           TaskKind
	Payload        []byte
	Binding        Binding
	Deadline       time.Time
	MaxResultBytes int
}

// DecisionRecorder durably records a decision before any specialist runs.
type DecisionRecorder interface {
	RecordDecision(context.Context, Decision) error
}

// Specialist performs one bounded development invocation.
type Specialist interface {
	Invoke(context.Context, Invocation) (SpecialistResult, error)
}

// ExactVerifier scores a candidate independently of the originating specialist.
type ExactVerifier interface {
	Verify(context.Context, Invocation, Candidate) (Verification, error)
}

// RunResult retains both the pre-effect decision and terminal construction state.
type RunResult struct {
	Decision Decision
	Outcome  Outcome
}

// Runner owns the deliberately thin decision-record-effect-verification seam.
type Runner struct {
	policy      Policy
	recorder    DecisionRecorder
	specialists map[string]Specialist
	verifier    ExactVerifier
	now         func() time.Time
}

// NewRunner closes the configured route/executor set before any request runs.
func NewRunner(
	policy Policy,
	recorder DecisionRecorder,
	specialists map[string]Specialist,
	verifier ExactVerifier,
	now func() time.Time,
) (Runner, error) {
	if recorder == nil || verifier == nil || now == nil {
		return Runner{}, errors.New("specialist-control runner dependencies must be present")
	}
	identities := policy.specialistIDs()
	if len(specialists) != len(identities) {
		return Runner{}, errors.New("specialist-control executor set does not match policy routes")
	}
	validated := make(map[string]Specialist, len(specialists))
	for _, specialistID := range identities {
		specialist, present := specialists[specialistID]
		if !present || specialist == nil {
			return Runner{}, fmt.Errorf("specialist-control executor missing for %s", specialistID)
		}
		validated[specialistID] = specialist
	}
	return Runner{policy: policy, recorder: recorder, specialists: validated, verifier: verifier, now: now}, nil
}

// Run records the pure policy decision before invoking any specialist effect.
func (runner Runner) Run(ctx context.Context, request Request) (RunResult, error) {
	request.Payload = append([]byte(nil), request.Payload...)
	decision := runner.policy.Decide(runner.now(), request)
	run := RunResult{Decision: decision, Outcome: outcomeFromDecision(decision)}
	if err := runner.recorder.RecordDecision(ctx, decision); err != nil {
		return run, fmt.Errorf("record specialist-control decision: %w", err)
	}
	if decision.State != DecisionInvoke {
		return run, nil
	}
	if err := ctx.Err(); err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, specialistFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("specialist-control context ended before invocation: %w", err)
	}
	invocationAt := runner.now()
	if invocationAt.IsZero() || invocationAt.Before(decision.DecidedAt) {
		run.Outcome = terminalOutcome(OutcomeRefused, ReasonMalformedRequest, decision.Binding, nil)
		return run, nil
	}
	remaining := decision.Deadline.Sub(invocationAt)
	if remaining <= 0 {
		run.Outcome = terminalOutcome(OutcomeAbstained, ReasonDeadlineElapsed, decision.Binding, nil)
		return run, nil
	}
	if remaining > runner.policy.limits.MaxExecution {
		run.Outcome = terminalOutcome(OutcomeRefused, ReasonDeadlineOutOfRange, decision.Binding, nil)
		return run, nil
	}

	invocation := invocationFor(request, decision)
	invokeContext, cancel := context.WithTimeout(ctx, remaining)
	defer cancel()
	if err := invokeContext.Err(); err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, specialistFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("specialist-control context ended before invocation: %w", err)
	}
	result, err := runner.specialists[decision.SpecialistID].Invoke(invokeContext, invocation)
	if err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, specialistFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("invoke specialist %s: %w", decision.SpecialistID, err)
	}
	result = snapshotResult(result, decision.MaxResultBytes)
	if err := invokeContext.Err(); err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, specialistFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("specialist %s exceeded its execution context: %w", decision.SpecialistID, err)
	}

	observedAt := runner.now()
	resultDecision := runner.policy.InspectResult(observedAt, request, decision, result)
	if resultDecision.State != ResultVerify {
		run.Outcome = runner.policy.Finalise(observedAt, request, decision, resultDecision, Verification{})
		return run, nil
	}
	if err := invokeContext.Err(); err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, verificationFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("specialist-control context ended before verification: %w", err)
	}
	normalizedCandidate := Candidate{
		Binding:          resultDecision.Binding,
		CandidateBinding: resultDecision.CandidateBinding,
		SpecialistID:     decision.SpecialistID,
		State:            ResultCompleted,
		Payload:          append([]byte(nil), resultDecision.Payload...),
	}
	verification, err := runner.verifier.Verify(invokeContext, invocationFor(request, decision), normalizedCandidate)
	if err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, verificationFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("verify specialist %s output: %w", decision.SpecialistID, err)
	}
	if err := invokeContext.Err(); err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, verificationFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("verification for specialist %s exceeded its execution context: %w", decision.SpecialistID, err)
	}
	finalisedAt := runner.now()
	if err := invokeContext.Err(); err != nil {
		run.Outcome = terminalOutcome(OutcomeAbstained, verificationFailureReason(err), decision.Binding, nil)
		return run, fmt.Errorf("specialist-control context ended before finalisation: %w", err)
	}
	run.Outcome = runner.policy.Finalise(finalisedAt, request, decision, resultDecision, verification)
	return run, nil
}

func invocationFor(request Request, decision Decision) Invocation {
	return Invocation{
		RunID:          request.RunID,
		RequestID:      request.RequestID,
		Task:           request.Task,
		Payload:        append([]byte(nil), request.Payload...),
		Binding:        decision.Binding,
		Deadline:       decision.Deadline,
		MaxResultBytes: decision.MaxResultBytes,
	}
}

func snapshotResult(result SpecialistResult, maximumBytes int) SpecialistResult {
	if len(result.Payload) > maximumBytes {
		result.Payload = make([]byte, maximumBytes+1)
		return result
	}
	result.Payload = append([]byte(nil), result.Payload...)
	return result
}

func outcomeFromDecision(decision Decision) Outcome {
	switch decision.State {
	case DecisionAbstain:
		return terminalOutcome(OutcomeAbstained, decision.Reason, decision.Binding, nil)
	case DecisionInvoke:
		return terminalOutcome(OutcomeAbstained, ReasonSpecialistFailed, decision.Binding, nil)
	default:
		return terminalOutcome(OutcomeRefused, decision.Reason, decision.Binding, nil)
	}
}

func specialistFailureReason(err error) Reason {
	if errors.Is(err, context.Canceled) {
		return ReasonCancelled
	}
	if errors.Is(err, context.DeadlineExceeded) {
		return ReasonDeadlineElapsed
	}
	return ReasonSpecialistFailed
}

func verificationFailureReason(err error) Reason {
	if errors.Is(err, context.Canceled) {
		return ReasonCancelled
	}
	if errors.Is(err, context.DeadlineExceeded) {
		return ReasonDeadlineElapsed
	}
	return ReasonVerificationFailed
}
