// Package specialistcontrol defines the development-only typed-specialist
// control boundary. It does not confer scientific result authority.
package specialistcontrol

import (
	"crypto/sha256"
	"encoding/binary"
	"errors"
	"fmt"
	"sort"
	"time"
)

const (
	// ResultAuthority labels every construction output from this package.
	ResultAuthority  = "NO_RESULT"
	maxIdentityBytes = 128
)

// TaskKind is one accepted CLRS-Text development-shakedown task family.
type TaskKind string

const (
	TaskInsertionSort     TaskKind = "insertion_sort"
	TaskBinarySearch      TaskKind = "binary_search"
	TaskMatrixChainOrder  TaskKind = "matrix_chain_order"
	TaskBellmanFord       TaskKind = "bellman_ford"
	TaskKMPMatcher        TaskKind = "kmp_matcher"
	TaskSegmentsIntersect TaskKind = "segments_intersect"
)

var taskKinds = []TaskKind{
	TaskInsertionSort,
	TaskBinarySearch,
	TaskMatrixChainOrder,
	TaskBellmanFord,
	TaskKMPMatcher,
	TaskSegmentsIntersect,
}

// Limits are caller-owned development bounds. They are not model, dataset, or
// claim thresholds.
type Limits struct {
	MaxRequestBytes int
	MaxResultBytes  int
	MaxRequestAge   time.Duration
	MaxExecution    time.Duration
}

// Route binds one task kind to one development specialist implementation.
type Route struct {
	Task         TaskKind
	SpecialistID string
}

// Request is the bounded opaque packet seen equally by every future arm.
type Request struct {
	RunID     string
	RequestID string
	Task      TaskKind
	Payload   []byte
	IssuedAt  time.Time
	Deadline  time.Time
}

// Binding is a deterministic request/route identity, not evidence authority.
type Binding [sha256.Size]byte

// DecisionState is the terminal policy state before a specialist effect.
type DecisionState string

const (
	DecisionInvoke  DecisionState = "invoke"
	DecisionRefuse  DecisionState = "refuse"
	DecisionAbstain DecisionState = "abstain"
)

// Reason is a closed machine-readable explanation for a decision or outcome.
type Reason string

const (
	ReasonReady                 Reason = "ready"
	ReasonMalformedRequest      Reason = "malformed-request"
	ReasonUnknownTask           Reason = "unknown-task"
	ReasonOversizedRequest      Reason = "oversized-request"
	ReasonStaleRequest          Reason = "stale-request"
	ReasonDeadlineElapsed       Reason = "deadline-elapsed"
	ReasonDeadlineOutOfRange    Reason = "deadline-out-of-range"
	ReasonCancelled             Reason = "cancelled"
	ReasonMalformedResult       Reason = "malformed-result"
	ReasonUnknownResult         Reason = "unknown-result"
	ReasonStaleResult           Reason = "stale-result"
	ReasonOversizedResult       Reason = "oversized-result"
	ReasonSpecialistAbstained   Reason = "specialist-abstained"
	ReasonSpecialistRefused     Reason = "specialist-refused"
	ReasonSpecialistFailed      Reason = "specialist-failed"
	ReasonVerificationMismatch  Reason = "verification-mismatch"
	ReasonVerificationAbstained Reason = "verification-abstained"
	ReasonVerificationFailed    Reason = "verification-failed"
)

// Decision is the pure policy output that must be recorded before invocation.
type Decision struct {
	State          DecisionState
	Reason         Reason
	Authority      string
	RunID          string
	RequestID      string
	Task           TaskKind
	SpecialistID   string
	Binding        Binding
	Deadline       time.Time
	MaxResultBytes int
}

// SpecialistResult is the bounded candidate returned across the effect seam.
type SpecialistResult struct {
	Binding      Binding
	SpecialistID string
	State        ResultState
	Payload      []byte
}

// ResultState is a specialist's explicit response state.
type ResultState string

const (
	ResultCompleted ResultState = "completed"
	ResultRefused   ResultState = "refused"
	ResultAbstained ResultState = "abstained"
)

// ResultDecision determines whether a candidate may reach the independent
// verifier or must terminate first.
type ResultDecision struct {
	State     ResultDecisionState
	Reason    Reason
	Authority string
	Binding   Binding
	Payload   []byte
}

// ResultDecisionState is the policy state after specialist execution.
type ResultDecisionState string

const (
	ResultVerify  ResultDecisionState = "verify"
	ResultRefuse  ResultDecisionState = "refuse"
	ResultAbstain ResultDecisionState = "abstain"
)

// Verification is returned by a separate exact-scoring implementation.
type Verification struct {
	Binding Binding
	Verdict VerificationVerdict
}

// VerificationVerdict is the verifier's closed response vocabulary.
type VerificationVerdict string

const (
	VerificationExact    VerificationVerdict = "exact"
	VerificationMismatch VerificationVerdict = "mismatch"
	VerificationAbstain  VerificationVerdict = "abstain"
)

// Outcome is the development-only terminal state. Even a verified output
// remains NO_RESULT until a separate experiment contract grants authority.
type Outcome struct {
	State     OutcomeState
	Reason    Reason
	Authority string
	Binding   Binding
	Payload   []byte
}

// OutcomeState is the terminal runner state.
type OutcomeState string

const (
	OutcomeVerified  OutcomeState = "verified"
	OutcomeRefused   OutcomeState = "refused"
	OutcomeAbstained OutcomeState = "abstained"
)

// Policy is immutable after construction and performs no effects.
type Policy struct {
	limits Limits
	routes map[TaskKind]string
}

// NewPolicy validates one exact-program route for each accepted shakedown task.
func NewPolicy(limits Limits, routes []Route) (Policy, error) {
	if limits.MaxRequestBytes <= 0 || limits.MaxResultBytes <= 0 ||
		limits.MaxRequestAge <= 0 || limits.MaxExecution <= 0 {
		return Policy{}, errors.New("specialist-control limits must be positive")
	}
	if len(routes) != len(taskKinds) {
		return Policy{}, fmt.Errorf("specialist-control route count = %d, want %d", len(routes), len(taskKinds))
	}
	knownTasks := make(map[TaskKind]bool, len(taskKinds))
	for _, task := range taskKinds {
		knownTasks[task] = true
	}
	validated := make(map[TaskKind]string, len(routes))
	seenSpecialists := make(map[string]bool, len(routes))
	for _, route := range routes {
		if !knownTasks[route.Task] || !validIdentity(route.SpecialistID) {
			return Policy{}, fmt.Errorf("invalid specialist-control route %q/%q", route.Task, route.SpecialistID)
		}
		if _, duplicate := validated[route.Task]; duplicate || seenSpecialists[route.SpecialistID] {
			return Policy{}, fmt.Errorf("duplicate specialist-control route %q/%q", route.Task, route.SpecialistID)
		}
		validated[route.Task] = route.SpecialistID
		seenSpecialists[route.SpecialistID] = true
	}
	return Policy{limits: limits, routes: validated}, nil
}

// Tasks returns the accepted task kinds in deterministic order.
func Tasks() []TaskKind {
	tasks := append([]TaskKind(nil), taskKinds...)
	sort.Slice(tasks, func(left, right int) bool { return tasks[left] < tasks[right] })
	return tasks
}

// Decide returns a deterministic route, refusal, or abstention without effects.
func (policy Policy) Decide(now time.Time, request Request) Decision {
	decision := Decision{
		State:          DecisionRefuse,
		Reason:         ReasonMalformedRequest,
		Authority:      ResultAuthority,
		RunID:          request.RunID,
		RequestID:      request.RequestID,
		Task:           request.Task,
		Deadline:       request.Deadline,
		MaxResultBytes: policy.limits.MaxResultBytes,
	}
	specialistID, knownTask := policy.routes[request.Task]
	if !knownTask {
		decision.Reason = ReasonUnknownTask
		return decision
	}
	if !validRequestMetadata(now, request) {
		return decision
	}
	if len(request.Payload) > policy.limits.MaxRequestBytes {
		decision.Reason = ReasonOversizedRequest
		return decision
	}
	decision.Binding = bindRequest(request, specialistID)
	if !now.Before(request.Deadline) {
		decision.State = DecisionAbstain
		decision.Reason = ReasonDeadlineElapsed
		return decision
	}
	if request.Deadline.Sub(now) > policy.limits.MaxExecution {
		decision.Reason = ReasonDeadlineOutOfRange
		return decision
	}
	if now.Sub(request.IssuedAt) > policy.limits.MaxRequestAge {
		decision.State = DecisionAbstain
		decision.Reason = ReasonStaleRequest
		return decision
	}
	decision.State = DecisionInvoke
	decision.Reason = ReasonReady
	decision.SpecialistID = specialistID
	return decision
}

// InspectResult determines whether a candidate may be independently verified.
func (policy Policy) InspectResult(now time.Time, request Request, decision Decision, result SpecialistResult) ResultDecision {
	checked := ResultDecision{State: ResultRefuse, Reason: ReasonMalformedResult, Authority: ResultAuthority, Binding: decision.Binding}
	if !policy.validDecision(request, decision) {
		return checked
	}
	if !now.Before(decision.Deadline) {
		checked.State = ResultAbstain
		checked.Reason = ReasonDeadlineElapsed
		return checked
	}
	if result.Binding != decision.Binding {
		checked.Reason = ReasonStaleResult
		return checked
	}
	if result.SpecialistID != decision.SpecialistID {
		checked.Reason = ReasonUnknownResult
		return checked
	}
	if len(result.Payload) > decision.MaxResultBytes {
		checked.Reason = ReasonOversizedResult
		return checked
	}
	switch result.State {
	case ResultCompleted:
		if len(result.Payload) == 0 {
			return checked
		}
		checked.State = ResultVerify
		checked.Reason = ReasonReady
		checked.Payload = append([]byte(nil), result.Payload...)
	case ResultRefused:
		if len(result.Payload) != 0 {
			return checked
		}
		checked.Reason = ReasonSpecialistRefused
	case ResultAbstained:
		if len(result.Payload) != 0 {
			return checked
		}
		checked.State = ResultAbstain
		checked.Reason = ReasonSpecialistAbstained
	}
	return checked
}

// Finalise converts an independent verification into a terminal NO_RESULT outcome.
func (policy Policy) Finalise(result ResultDecision, verification Verification) Outcome {
	if result.State == ResultRefuse {
		return terminalOutcome(OutcomeRefused, result.Reason, result.Binding, nil)
	}
	if result.State == ResultAbstain {
		return terminalOutcome(OutcomeAbstained, result.Reason, result.Binding, nil)
	}
	if result.State != ResultVerify || result.Reason != ReasonReady || result.Authority != ResultAuthority ||
		result.Binding == (Binding{}) || len(result.Payload) == 0 || len(result.Payload) > policy.limits.MaxResultBytes ||
		verification.Binding != result.Binding {
		return terminalOutcome(OutcomeRefused, ReasonStaleResult, result.Binding, nil)
	}
	switch verification.Verdict {
	case VerificationExact:
		return terminalOutcome(OutcomeVerified, ReasonReady, result.Binding, result.Payload)
	case VerificationMismatch:
		return terminalOutcome(OutcomeAbstained, ReasonVerificationMismatch, result.Binding, nil)
	case VerificationAbstain:
		return terminalOutcome(OutcomeAbstained, ReasonVerificationAbstained, result.Binding, nil)
	default:
		return terminalOutcome(OutcomeRefused, ReasonMalformedResult, result.Binding, nil)
	}
}

func (policy Policy) specialistIDs() []string {
	identities := make([]string, 0, len(policy.routes))
	for _, specialistID := range policy.routes {
		identities = append(identities, specialistID)
	}
	sort.Strings(identities)
	return identities
}

func (policy Policy) validDecision(request Request, decision Decision) bool {
	expectedSpecialist, knownTask := policy.routes[request.Task]
	return knownTask && decision.State == DecisionInvoke && decision.Reason == ReasonReady &&
		decision.Authority == ResultAuthority && decision.RunID == request.RunID &&
		decision.RequestID == request.RequestID && decision.Task == request.Task &&
		decision.SpecialistID == expectedSpecialist && decision.Deadline.Equal(request.Deadline) &&
		decision.MaxResultBytes == policy.limits.MaxResultBytes &&
		decision.Binding == bindRequest(request, expectedSpecialist)
}

func validRequestMetadata(now time.Time, request Request) bool {
	return !now.IsZero() && validIdentity(request.RunID) && validIdentity(request.RequestID) &&
		len(request.Payload) > 0 && !request.IssuedAt.IsZero() && !request.Deadline.IsZero() &&
		!request.IssuedAt.After(now) && request.Deadline.After(request.IssuedAt)
}

func validIdentity(value string) bool {
	if len(value) == 0 || len(value) > maxIdentityBytes {
		return false
	}
	for index := range len(value) {
		character := value[index]
		if (character < 'a' || character > 'z') && (character < 'A' || character > 'Z') &&
			(character < '0' || character > '9') && character != '.' && character != '_' && character != ':' && character != '-' {
			return false
		}
	}
	return true
}

func bindRequest(request Request, specialistID string) Binding {
	hash := sha256.New()
	for _, value := range []string{request.RunID, request.RequestID, string(request.Task), specialistID} {
		_ = binary.Write(hash, binary.BigEndian, uint64(len(value)))
		_, _ = hash.Write([]byte(value))
	}
	for _, value := range []int64{request.IssuedAt.UnixNano(), request.Deadline.UnixNano(), int64(len(request.Payload))} {
		_ = binary.Write(hash, binary.BigEndian, value)
	}
	_, _ = hash.Write(request.Payload)
	var binding Binding
	copy(binding[:], hash.Sum(nil))
	return binding
}

func terminalOutcome(state OutcomeState, reason Reason, binding Binding, payload []byte) Outcome {
	return Outcome{
		State:     state,
		Reason:    reason,
		Authority: ResultAuthority,
		Binding:   binding,
		Payload:   append([]byte(nil), payload...),
	}
}
