package specialistcontrol

import (
	"slices"
	"strings"
	"testing"
	"time"
)

var testNow = time.Date(2026, time.August, 30, 18, 0, 0, 0, time.UTC)

func TestPolicyRoutesTheAcceptedSixTaskSubsetDeterministically(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	tasks := Tasks()
	wantTasks := []TaskKind{
		TaskBellmanFord,
		TaskBinarySearch,
		TaskInsertionSort,
		TaskKMPMatcher,
		TaskMatrixChainOrder,
		TaskSegmentsIntersect,
	}
	if !slices.Equal(tasks, wantTasks) {
		t.Fatalf("Tasks() = %v, want exact upstream IDs %v", tasks, wantTasks)
	}
	for _, task := range tasks {
		request := testRequest(task)
		first := policy.Decide(testNow, request)
		second := policy.Decide(testNow, request)
		if first != second || first.State != DecisionInvoke || first.Reason != ReasonReady {
			t.Fatalf("Decide(%s) = %#v then %#v, want identical invoke decisions", task, first, second)
		}
		if first.Authority != ResultAuthority || first.SpecialistID != "exact-"+string(task) || first.Binding == (Binding{}) {
			t.Fatalf("Decide(%s) identity = %#v, want bound NO_RESULT route", task, first)
		}
		later := policy.Decide(testNow.Add(time.Nanosecond), request)
		if first.DecidedAt != testNow || later.DecidedAt == first.DecidedAt || later.Binding == first.Binding {
			t.Fatalf("Decide(%s) decision-time binding = %s/%x then %s/%x", task, first.DecidedAt, first.Binding, later.DecidedAt, later.Binding)
		}
	}
}

func TestNewPolicyRejectsOpenOrAmbiguousRouteSets(t *testing.T) {
	t.Parallel()
	limits := testLimits()
	for name, mutate := range map[string]func([]Route) []Route{
		"missing task": func(routes []Route) []Route { return routes[:len(routes)-1] },
		"unknown task": func(routes []Route) []Route {
			routes[0].Task = "unknown"
			return routes
		},
		"duplicate task": func(routes []Route) []Route {
			routes[1].Task = routes[0].Task
			return routes
		},
		"duplicate specialist": func(routes []Route) []Route {
			routes[1].SpecialistID = routes[0].SpecialistID
			return routes
		},
	} {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, err := NewPolicy(limits, mutate(testRoutes())); err == nil {
				t.Fatal("NewPolicy() error = nil, want closed-route rejection")
			}
		})
	}
	invalidLimits := testLimits()
	invalidLimits.MaxExecution = 0
	if _, err := NewPolicy(invalidLimits, testRoutes()); err == nil {
		t.Fatal("NewPolicy() error = nil, want positive execution-horizon rejection")
	}
}

func TestPolicyTypesInvalidRequestTermination(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	valid := testRequest(TaskInsertionSort)
	tests := []struct {
		name   string
		at     time.Time
		mutate func(*Request)
		state  DecisionState
		reason Reason
	}{
		{name: "unknown task", mutate: func(request *Request) { request.Task = "unknown" }, state: DecisionRefuse, reason: ReasonUnknownTask},
		{name: "malformed identity", mutate: func(request *Request) { request.RequestID = "request id" }, state: DecisionRefuse, reason: ReasonMalformedRequest},
		{name: "empty payload", mutate: func(request *Request) { request.Payload = nil }, state: DecisionRefuse, reason: ReasonMalformedRequest},
		{name: "oversized", mutate: func(request *Request) { request.Payload = []byte(strings.Repeat("x", 33)) }, state: DecisionRefuse, reason: ReasonOversizedRequest},
		{name: "future issue", mutate: func(request *Request) { request.IssuedAt = testNow.Add(time.Second) }, state: DecisionRefuse, reason: ReasonMalformedRequest},
		{name: "stale", at: testNow.Add(11 * time.Second), state: DecisionAbstain, reason: ReasonStaleRequest},
		{name: "deadline", at: valid.Deadline, state: DecisionAbstain, reason: ReasonDeadlineElapsed},
		{name: "deadline out of range", mutate: func(request *Request) { request.Deadline = testNow.Add(3 * time.Minute) }, state: DecisionRefuse, reason: ReasonDeadlineOutOfRange},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			request := valid
			request.Payload = append([]byte(nil), valid.Payload...)
			if test.mutate != nil {
				test.mutate(&request)
			}
			at := test.at
			if at.IsZero() {
				at = testNow
			}
			decision := policy.Decide(at, request)
			if decision.State != test.state || decision.Reason != test.reason || decision.Authority != ResultAuthority {
				t.Fatalf("Decide() = %s/%s/%s, want %s/%s/%s", decision.State, decision.Reason, decision.Authority, test.state, test.reason, ResultAuthority)
			}
		})
	}
}

func TestPolicyRefusesUnsafeSpecialistResultsBeforeVerification(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskBinarySearch)
	decision := policy.Decide(testNow, request)
	valid := SpecialistResult{
		Binding:      decision.Binding,
		SpecialistID: decision.SpecialistID,
		State:        ResultCompleted,
		Payload:      []byte(`{"index":2}`),
	}
	tests := []struct {
		name   string
		at     time.Time
		mutate func(*SpecialistResult)
		state  ResultDecisionState
		reason Reason
	}{
		{name: "stale binding", mutate: func(result *SpecialistResult) { result.Binding[0]++ }, state: ResultRefuse, reason: ReasonStaleResult},
		{name: "unknown specialist", mutate: func(result *SpecialistResult) { result.SpecialistID = "other" }, state: ResultRefuse, reason: ReasonUnknownResult},
		{name: "oversized", mutate: func(result *SpecialistResult) { result.Payload = []byte(strings.Repeat("x", 17)) }, state: ResultRefuse, reason: ReasonOversizedResult},
		{name: "malformed completed", mutate: func(result *SpecialistResult) { result.Payload = nil }, state: ResultRefuse, reason: ReasonMalformedResult},
		{name: "malformed state", mutate: func(result *SpecialistResult) { result.State = "unknown" }, state: ResultRefuse, reason: ReasonMalformedResult},
		{name: "specialist refusal", mutate: func(result *SpecialistResult) { result.State, result.Payload = ResultRefused, nil }, state: ResultRefuse, reason: ReasonSpecialistRefused},
		{name: "specialist abstention", mutate: func(result *SpecialistResult) { result.State, result.Payload = ResultAbstained, nil }, state: ResultAbstain, reason: ReasonSpecialistAbstained},
		{name: "timed out", at: request.Deadline, state: ResultAbstain, reason: ReasonDeadlineElapsed},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			result := valid
			result.Payload = append([]byte(nil), valid.Payload...)
			if test.mutate != nil {
				test.mutate(&result)
			}
			at := test.at
			if at.IsZero() {
				at = testNow
			}
			checked := policy.InspectResult(at, request, decision, result)
			if checked.State != test.state || checked.Reason != test.reason || checked.Authority != ResultAuthority {
				t.Fatalf("InspectResult() = %s/%s/%s, want %s/%s/%s", checked.State, checked.Reason, checked.Authority, test.state, test.reason, ResultAuthority)
			}
		})
	}
	checked := policy.InspectResult(testNow, request, decision, valid)
	if checked.State != ResultVerify || !slices.Equal(checked.Payload, valid.Payload) {
		t.Fatalf("InspectResult(valid) = %#v, want independent verification", checked)
	}
}

func TestPolicyInspectResultRefusesInvalidObservationTimes(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskBinarySearch)
	decision := policy.Decide(testNow, request)
	result := SpecialistResult{
		Binding:      decision.Binding,
		SpecialistID: decision.SpecialistID,
		State:        ResultCompleted,
		Payload:      []byte("answer"),
	}
	for name, observedAt := range map[string]time.Time{
		"zero":                 {},
		"before issuance":      request.IssuedAt.Add(-time.Nanosecond),
		"before decision time": decision.DecidedAt.Add(-time.Nanosecond),
	} {
		name, observedAt := name, observedAt
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			checked := policy.InspectResult(observedAt, request, decision, result)
			if checked.State != ResultRefuse || checked.Reason != ReasonMalformedResult ||
				checked.Authority != ResultAuthority {
				t.Fatalf("InspectResult(%s) = %#v, want typed NO_RESULT refusal", name, checked)
			}
		})
	}
}

func TestPolicyRejectsForgedOrMutatedRecordedDecisions(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskInsertionSort)
	validDecision := policy.Decide(testNow, request)
	validResult := SpecialistResult{
		Binding:      validDecision.Binding,
		SpecialistID: validDecision.SpecialistID,
		State:        ResultCompleted,
		Payload:      []byte("answer"),
	}
	mutations := map[string]func(*Decision){
		"state":            func(decision *Decision) { decision.State = DecisionAbstain },
		"reason":           func(decision *Decision) { decision.Reason = ReasonStaleRequest },
		"authority":        func(decision *Decision) { decision.Authority = "RESULT" },
		"run":              func(decision *Decision) { decision.RunID = "run-002" },
		"request":          func(decision *Decision) { decision.RequestID = "request-002" },
		"task":             func(decision *Decision) { decision.Task = TaskBinarySearch },
		"specialist":       func(decision *Decision) { decision.SpecialistID = "exact-other" },
		"decision time":    func(decision *Decision) { decision.DecidedAt = decision.DecidedAt.Add(time.Nanosecond) },
		"deadline":         func(decision *Decision) { decision.Deadline = decision.Deadline.Add(time.Second) },
		"max result bytes": func(decision *Decision) { decision.MaxResultBytes++ },
		"binding":          func(decision *Decision) { decision.Binding[0]++ },
	}
	for name, mutate := range mutations {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			decision := validDecision
			mutate(&decision)
			checked := policy.InspectResult(testNow, request, decision, validResult)
			if checked.State != ResultRefuse || checked.Reason != ReasonMalformedResult {
				t.Fatalf("InspectResult(mutated %s) = %#v, want malformed-result refusal", name, checked)
			}
		})
	}
}

func TestPolicyFinaliseNeverPromotesConstructionOutput(t *testing.T) {
	t.Parallel()
	policy := testPolicy(t)
	request := testRequest(TaskBellmanFord)
	decision := policy.Decide(testNow, request)
	result := SpecialistResult{Binding: decision.Binding, SpecialistID: decision.SpecialistID, State: ResultCompleted, Payload: []byte("answer")}
	checked := policy.InspectResult(testNow, request, decision, result)

	for verdict, expected := range map[VerificationVerdict]OutcomeState{
		VerificationExact:    OutcomeVerified,
		VerificationMismatch: OutcomeAbstained,
		VerificationAbstain:  OutcomeAbstained,
		"unknown":            OutcomeRefused,
	} {
		outcome := policy.Finalise(testNow, request, decision, checked, Verification{
			Binding: decision.Binding, CandidateBinding: checked.CandidateBinding, Verdict: verdict,
		})
		if outcome.State != expected || outcome.Authority != ResultAuthority {
			t.Fatalf("Finalise(%s) = %s/%s, want %s/%s", verdict, outcome.State, outcome.Authority, expected, ResultAuthority)
		}
	}
	stale := decision.Binding
	stale[0]++
	outcome := policy.Finalise(testNow, request, decision, checked, Verification{
		Binding: stale, CandidateBinding: checked.CandidateBinding, Verdict: VerificationExact,
	})
	if outcome.State != OutcomeRefused || outcome.Reason != ReasonStaleResult || len(outcome.Payload) != 0 {
		t.Fatalf("Finalise(stale) = %#v, want closed stale-verification refusal", outcome)
	}
	forged := checked
	forged.Authority = "RESULT"
	outcome = policy.Finalise(testNow, request, decision, forged, Verification{
		Binding: decision.Binding, CandidateBinding: checked.CandidateBinding, Verdict: VerificationExact,
	})
	if outcome.State != OutcomeRefused || outcome.Authority != ResultAuthority {
		t.Fatalf("Finalise(forged authority) = %#v, want NO_RESULT refusal", outcome)
	}
	substituted := checked
	substituted.Payload = append([]byte(nil), checked.Payload...)
	substituted.Payload[0] ^= 0xff
	outcome = policy.Finalise(testNow, request, decision, substituted, Verification{
		Binding: decision.Binding, CandidateBinding: checked.CandidateBinding, Verdict: VerificationExact,
	})
	if outcome.State != OutcomeRefused || outcome.Reason != ReasonStaleResult || len(outcome.Payload) != 0 {
		t.Fatalf("Finalise(substituted candidate) = %#v, want candidate-binding refusal", outcome)
	}
	wrongSpecialist := checked
	wrongSpecialist.SpecialistID = "exact-other"
	wrongSpecialist.CandidateBinding = bindCandidate(
		wrongSpecialist.Binding, wrongSpecialist.SpecialistID, ResultCompleted, wrongSpecialist.Payload,
	)
	outcome = policy.Finalise(testNow, request, decision, wrongSpecialist, Verification{
		Binding: decision.Binding, CandidateBinding: wrongSpecialist.CandidateBinding, Verdict: VerificationExact,
	})
	if outcome.State != OutcomeRefused || len(outcome.Payload) != 0 {
		t.Fatalf("Finalise(substituted specialist) = %#v, want route-bound refusal", outcome)
	}
}

func testPolicy(t *testing.T) Policy {
	t.Helper()
	return testPolicyWithLimits(t, testLimits())
}

func testPolicyWithLimits(t *testing.T, limits Limits) Policy {
	t.Helper()
	policy, err := NewPolicy(limits, testRoutes())
	if err != nil {
		t.Fatalf("NewPolicy() error = %v", err)
	}
	return policy
}

func testLimits() Limits {
	return Limits{
		MaxRequestBytes: 32,
		MaxResultBytes:  16,
		MaxRequestAge:   10 * time.Second,
		MaxExecution:    2 * time.Minute,
	}
}

func testRoutes() []Route {
	tasks := Tasks()
	routes := make([]Route, 0, len(tasks))
	for index := len(tasks) - 1; index >= 0; index-- {
		task := tasks[index]
		routes = append(routes, Route{Task: task, SpecialistID: "exact-" + string(task)})
	}
	return routes
}

func testRequest(task TaskKind) Request {
	return Request{
		RunID:     "run-001",
		RequestID: "request-001",
		Task:      task,
		Payload:   []byte(`{"input":[3,1,2]}`),
		IssuedAt:  testNow.Add(-time.Second),
		Deadline:  testNow.Add(time.Minute),
	}
}
