"""Line-delimited worker protocol for the FM-T02 workstation runner."""

from __future__ import annotations

import hashlib
import json
import os
import platform
import sys
import time
import traceback
from typing import Any

import numpy as np

from analysis import ANALYSIS_VERSION, analyze_contrasts
from evaluator import EVALUATOR_VERSION, evaluate_truth
from generator import GENERATOR_VERSION, canonical_json, generate_world
from simulator import SIMULATOR_VERSION, forecast_arms

WORKER_VERSION = "fixture-019.fm-t02-worker.v2"
CELLS = {
    "base": {"common_share": 0.35, "eta": 0.10, "funding_enabled": False},
    "eta-zero": {"common_share": 0.35, "eta": 0.0, "funding_enabled": False},
    "overlap-high": {"common_share": 0.85, "eta": 0.20, "funding_enabled": False},
    "funding-on": {"common_share": 0.35, "eta": 0.10, "funding_enabled": True},
}

_TERMINAL_EXACT_FIELDS = (
    "terminal_status",
    "defaults",
    "rounds",
    "converged",
    "funding_triggered",
    "funding_call_executed",
    "funding_call_count",
    "price_floor_hit",
)
_TERMINAL_SCALAR_TOLERANCES = {
    "delta_equity": 1e-10,
    "terminal_equity": 1e-10,
    "creditor_shortfall": 1e-10,
    "price_drawdown_percentage_points": 1e-12,
    "sale_quantity_asset_units": 1e-10,
    "max_price_change": 1e-12,
    "max_required_sale_fraction": 1e-12,
    "max_sale_identity_residual_currency": 1e-8,
    "max_balance_identity_residual_currency": 1e-8,
}


def _sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def _finite_close(left: Any, right: Any, tolerance: float) -> bool:
    try:
        left_value = float(left)
        right_value = float(right)
    except (TypeError, ValueError):
        return False
    return bool(
        np.isfinite(left_value)
        and np.isfinite(right_value)
        and abs(left_value - right_value) <= tolerance
    )


def _finite_vector_close(left: Any, right: Any, *, size: int, tolerance: float) -> bool:
    try:
        left_array = np.asarray(left, dtype=np.float64)
        right_array = np.asarray(right, dtype=np.float64)
    except (TypeError, ValueError):
        return False
    return bool(
        left_array.shape == (size,)
        and right_array.shape == (size,)
        and np.all(np.isfinite(left_array))
        and np.all(np.isfinite(right_array))
        and np.max(np.abs(left_array - right_array)) <= tolerance
    )


def _terminal_holdings_agree(forecast: dict[str, Any], truth: dict[str, Any]) -> bool:
    """Compare holdings exactly when possible, with a stated FP tolerance fallback."""

    try:
        forecast_bytes = bytes.fromhex(forecast["terminal_holdings_sha256_input"])
        truth_bytes = bytes.fromhex(truth["terminal_holdings_sha256_input"])
    except (KeyError, TypeError, ValueError):
        return False
    expected_bytes = 24 * 12 * np.dtype("<f8").itemsize
    if len(forecast_bytes) != expected_bytes or len(truth_bytes) != expected_bytes:
        return False
    if _sha256_bytes(forecast_bytes) == _sha256_bytes(truth_bytes):
        return True
    forecast_holdings = np.frombuffer(forecast_bytes, dtype="<f8")
    truth_holdings = np.frombuffer(truth_bytes, dtype="<f8")
    return bool(
        np.all(np.isfinite(forecast_holdings))
        and np.all(np.isfinite(truth_holdings))
        and np.max(np.abs(forecast_holdings - truth_holdings)) <= 1e-10
    )


def _independent_evaluator_agrees(
    forecast: dict[str, Any],
    truth: dict[str, Any],
    *,
    holdings_agree: bool,
) -> bool:
    """Fail closed unless every evaluator-owned terminal endpoint agrees."""

    holdings_hash_agrees = (
        isinstance(forecast.get("terminal_holdings_sha256"), str)
        and forecast.get("terminal_holdings_sha256") == truth.get("terminal_holdings_sha256")
    )
    if not holdings_hash_agrees and not holdings_agree:
        return False
    if any(forecast.get(field) != truth.get(field) for field in _TERMINAL_EXACT_FIELDS):
        return False
    if any(
        not _finite_close(forecast.get(field), truth.get(field), tolerance)
        for field, tolerance in _TERMINAL_SCALAR_TOLERANCES.items()
    ):
        return False
    return bool(
        _finite_vector_close(
            forecast.get("terminal_prices"),
            truth.get("terminal_prices"),
            size=12,
            tolerance=1e-12,
        )
        and _finite_vector_close(
            forecast.get("terminal_liabilities"),
            truth.get("terminal_liabilities"),
            size=24,
            tolerance=1e-10,
        )
    )


def _peak_rss_bytes() -> int | None:
    if os.name == "nt":
        try:
            import ctypes
            from ctypes import wintypes

            class Counters(ctypes.Structure):
                _fields_ = [
                    ("cb", wintypes.DWORD),
                    ("PageFaultCount", wintypes.DWORD),
                    ("PeakWorkingSetSize", ctypes.c_size_t),
                    ("WorkingSetSize", ctypes.c_size_t),
                    ("QuotaPeakPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
                    ("PagefileUsage", ctypes.c_size_t),
                    ("PeakPagefileUsage", ctypes.c_size_t),
                ]

            counters = Counters()
            counters.cb = ctypes.sizeof(counters)
            kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
            psapi = ctypes.WinDLL("psapi", use_last_error=True)
            kernel32.GetCurrentProcess.restype = wintypes.HANDLE
            psapi.GetProcessMemoryInfo.argtypes = [wintypes.HANDLE, ctypes.POINTER(Counters), wintypes.DWORD]
            psapi.GetProcessMemoryInfo.restype = wintypes.BOOL
            handle = kernel32.GetCurrentProcess()
            if psapi.GetProcessMemoryInfo(handle, ctypes.byref(counters), counters.cb):
                return int(counters.PeakWorkingSetSize)
        except Exception:
            return None
        return None
    try:
        import resource

        value = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        return int(value if sys.platform == "darwin" else value * 1024)
    except Exception:
        return None


def environment_record() -> dict[str, Any]:
    return {
        "worker_version": WORKER_VERSION,
        "python_version": platform.python_version(),
        "python_implementation": platform.python_implementation(),
        "numpy_version": np.__version__,
        "platform": platform.platform(),
        "byteorder": sys.byteorder,
        "bit_generator": "PCG64DXSM",
        "generator_version": GENERATOR_VERSION,
        "simulator_version": SIMULATOR_VERSION,
        "evaluator_version": EVALUATOR_VERSION,
        "analysis_version": ANALYSIS_VERSION,
    }


def _arm_projection(name: str, result: dict[str, Any], truth: dict[str, Any]) -> dict[str, Any]:
    holding_bytes = bytes.fromhex(result.pop("terminal_holdings_sha256_input"))
    delta_error = abs(float(result["delta_equity"]) - float(truth["delta_equity"]))
    raw_forecast_loss = min(1.0, delta_error / 240.0)
    return {
        **result,
        "terminal_holdings_sha256": _sha256_bytes(holding_bytes),
        "raw_forecast_loss": raw_forecast_loss,
        "forecast_loss": raw_forecast_loss,
        "absolute_default_count_error": abs(int(result["defaults"]) - int(truth["defaults"])),
        "nonconvergence": name != "one-pass" and not bool(result["converged"]),
        "abstained": False,
        "abstention_charge": 0.0,
        "score_assignment": "ordinary",
    }


def apply_registered_scoring(
    projected: dict[str, dict[str, Any]],
    truth: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    """Apply the registered finite adverse assignment and staged fallback."""
    fallback = projected["staged-liquidation-fallback"]
    truth_failed = truth["terminal_status"] != "ok" or not truth["converged"]
    fallback_usable = (
        fallback["terminal_status"] == "ok"
        and fallback["converged"]
        and not fallback["price_floor_hit"]
        and fallback["rounds"] < 1000
    )
    for name, result in projected.items():
        if truth_failed:
            result["forecast_loss"] = 1.0
            result["score_assignment"] = "lmax-evaluator-failure"
            continue
        hard_failure = result["terminal_status"] != "ok"
        boundary_abstention = result["price_floor_hit"] or result["rounds"] >= 1000
        if hard_failure:
            result["forecast_loss"] = 1.0
            result["score_assignment"] = "lmax-hard-gate"
        elif name != "one-pass" and boundary_abstention:
            if name != "staged-liquidation-fallback" and fallback_usable:
                result["forecast_loss"] = min(1.0, fallback["raw_forecast_loss"] + 0.01)
                result["abstained"] = True
                result["abstention_charge"] = 0.01
                result["score_assignment"] = "staged-fallback-plus-charge"
            else:
                result["forecast_loss"] = 1.0
                result["score_assignment"] = "lmax-fallback-failure"
        elif result["nonconvergence"]:
            result["forecast_loss"] = 1.0
            result["score_assignment"] = "lmax-nonconvergence"
    return projected


def simulate(request: dict[str, Any]) -> dict[str, Any]:
    allowed = {"action", "seed", "split", "cell", "replicate"}
    if set(request) != allowed or request.get("action") != "simulate":
        raise ValueError("simulate request contains missing or unknown fields")
    seed = request["seed"]
    split = request["split"]
    cell_name = request["cell"]
    replicate = request["replicate"]
    if cell_name not in CELLS or split != "development" or not isinstance(replicate, int) or replicate < 0:
        raise ValueError("only frozen development FM-T02 cells are executable before release")
    parameters = CELLS[cell_name]
    wall_start = time.perf_counter_ns()
    cpu_start = time.process_time_ns()
    world = generate_world(seed, parameters["common_share"])
    truth_raw = evaluate_truth(world, eta=parameters["eta"], funding_enabled=parameters["funding_enabled"])
    forecasts = forecast_arms(world, eta=parameters["eta"], funding_enabled=parameters["funding_enabled"])
    fixed_raw = forecasts["full-fixed-point"]
    holdings_agree = _terminal_holdings_agree(fixed_raw, truth_raw)
    truth = truth_raw
    truth_holdings = bytes.fromhex(truth.pop("terminal_holdings_sha256_input"))
    truth = {**truth, "terminal_holdings_sha256": _sha256_bytes(truth_holdings)}
    projected = {
        name: _arm_projection(name, dict(value), truth)
        for name, value in forecasts.items()
    }
    projected = apply_registered_scoring(projected, truth)
    fixed = projected["full-fixed-point"]
    price_difference = max(
        abs(float(left) - float(right))
        for left, right in zip(fixed["terminal_prices"], truth["terminal_prices"], strict=True)
    )
    liability_difference = max(
        abs(float(left) - float(right))
        for left, right in zip(fixed["terminal_liabilities"], truth["terminal_liabilities"], strict=True)
    )
    evaluator_agreement = _independent_evaluator_agrees(
        fixed,
        truth,
        holdings_agree=holdings_agree,
    )
    identities_passed = all(
        float(value["max_sale_identity_residual_currency"]) <= 1e-8
        and float(value["max_balance_identity_residual_currency"]) <= 1e-8
        and float(value["max_negative_quantity"]) <= 1e-12
        for value in projected.values()
    ) and float(truth["max_sale_identity_residual_currency"]) <= 1e-8
    terminal_status = "ok" if evaluator_agreement and identities_passed and truth["terminal_status"] == "ok" else "hard_gate_failed"
    cpu_ns = time.process_time_ns() - cpu_start
    wall_ns = time.perf_counter_ns() - wall_start
    return {
        "schema": 1,
        "contract_version": "fixture-019.fm-t02-work-unit.v2",
        "artifact": "fixture-019",
        "protocol": "FM-T02-forecast",
        "claim_id": "C-1481",
        "split": split,
        "cell": cell_name,
        "replicate": replicate,
        "seed_uint64": seed,
        "world_sha256": world["world_sha256"],
        "generated_arrays_sha256": world["generated_arrays_sha256"],
        "numpy_version": world["numpy_version"],
        "bit_generator": world["bit_generator"],
        "parameters": parameters,
        "truth": truth,
        "arms": projected,
        "checks": {
            "independent_evaluator_agreement": evaluator_agreement,
            "independent_max_price_difference": price_difference,
            "independent_max_liability_difference": liability_difference,
            "balance_and_sale_identities": identities_passed,
            "eta_zero_boundary": (
                cell_name != "eta-zero"
                or abs(projected["one-pass"]["delta_equity"] - projected["full-fixed-point"]["delta_equity"]) <= 1e-10
            ),
            "funding_call_exactly_once": (
                cell_name != "funding-on"
                or not truth["funding_triggered"]
                or (truth["funding_call_executed"] and truth["funding_call_count"] == 1)
            ),
        },
        "terminal_status": terminal_status,
        "resources": {
            "worker_cpu_ns": cpu_ns,
            "worker_wall_ns": wall_ns,
            "worker_peak_rss_bytes": _peak_rss_bytes(),
            "modeled_energy_j": None,
            "measured_energy_j": None,
        },
        "units": {
            "equity_loss": "synthetic-currency-unit",
            "forecast_loss": "1",
            "price_drawdown": "percentage-point",
            "sale_quantity": "asset-unit",
            "rounds": "count",
            "cpu": "ns",
            "wall": "ns",
            "memory": "B",
        },
        "claim_eligible": False,
        "scientific_result": False,
        "measured_energy_present": False,
    }


def handle(request: dict[str, Any]) -> dict[str, Any]:
    action = request.get("action")
    if action == "environment":
        if set(request) != {"action"}:
            raise ValueError("environment request contains unknown fields")
        return environment_record()
    if action == "simulate":
        return simulate(request)
    if action == "analyze":
        allowed = {"action", "contrasts", "resamples", "label", "persist_directory"}
        if set(request) != allowed:
            raise ValueError("analyze request contains missing or unknown fields")
        return analyze_contrasts(
            request["contrasts"],
            resamples=request["resamples"],
            label=request["label"],
            persist_directory=request["persist_directory"],
        )
    raise ValueError("unknown worker action")


def main() -> int:
    for line in sys.stdin:
        try:
            request = json.loads(line)
            response = {"ok": True, "result": handle(request)}
        except Exception as error:
            response = {
                "ok": False,
                "error": str(error),
                "error_type": type(error).__name__,
                "traceback_sha256": hashlib.sha256(traceback.format_exc().encode("utf-8")).hexdigest(),
            }
        sys.stdout.write(canonical_json(response) + "\n")
        sys.stdout.flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
