"""Frozen statistical primitives for the FM-T02 execution slice."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
from typing import Any

import numpy as np

ANALYSIS_VERSION = "fixture-019.fm-t02-analysis.v2"
EXACT_SIGN_ENUMERATION_MAX_N = 20


def _low64(label: str) -> int:
    return int.from_bytes(hashlib.sha256(label.encode("utf-8")).digest()[-8:], "big")


def _finite_vector(values: list[float]) -> np.ndarray:
    array = np.asarray(values, dtype=np.float64)
    if array.ndim != 1 or array.size < 2 or not np.all(np.isfinite(array)):
        raise ValueError("analysis requires at least two finite seed contrasts")
    return array


def _exact_sign_chunk(start: int, count: int, n: int) -> np.ndarray:
    """Return a canonical slice of the 2**n sign assignments.

    Assignment numbers increase from zero and bit zero controls the first
    contrast.  Fixing the order makes both persisted evidence and its digest
    independent of chunk size or platform endianness.
    """

    assignments = np.arange(start, start + count, dtype=np.uint64)[:, None]
    bit_positions = np.arange(n, dtype=np.uint64)[None, :]
    bits = ((assignments >> bit_positions) & np.uint64(1)).astype(np.int8)
    return (bits * 2 - 1).astype(np.int8, copy=False)


def analyze_contrasts(
    contrasts: list[float],
    *,
    resamples: int,
    label: str,
    persist_directory: str | None = None,
) -> dict[str, Any]:
    values = _finite_vector(contrasts)
    if not isinstance(resamples, int) or resamples < 100 or resamples > 100_000:
        raise ValueError("resamples must be an integer from 100 through 100000")
    n = int(values.size)
    observed = float(values.mean())
    standard_error = float(values.std(ddof=1) / math.sqrt(n))
    exact_sign_test = n <= EXACT_SIGN_ENUMERATION_MAX_N
    sign_assignment_count = 1 << n if exact_sign_test else resamples
    sign_rng = None if exact_sign_test else np.random.Generator(
        np.random.PCG64DXSM(_low64(f"FM-v1|FM-T02|{label}|primary-sign"))
    )
    bootstrap_rng = np.random.Generator(
        np.random.PCG64DXSM(_low64(f"FM-v1|FM-T02|{label}|primary-bootstrap"))
    )
    sign_hash = hashlib.sha256()
    index_hash = hashlib.sha256()
    sign_file = None
    index_file = None
    if persist_directory is not None:
        directory = Path(persist_directory)
        directory.mkdir(parents=True, exist_ok=True)
        sign_file = (directory / "primary-sign-vectors.i8").open("wb")
        index_file = (directory / "primary-bootstrap-indices.u32le").open("wb")

    exceedances = 0
    t_values: list[np.ndarray] = []
    try:
        remaining = sign_assignment_count
        assignment_start = 0
        while remaining:
            count = min(4096, remaining)
            if exact_sign_test:
                signs = _exact_sign_chunk(assignment_start, count, n)
            else:
                assert sign_rng is not None
                signs = sign_rng.integers(0, 2, size=(count, n), dtype=np.int8)
                signs = (signs * 2 - 1).astype(np.int8, copy=False)
            sign_bytes = signs.tobytes(order="C")
            sign_hash.update(sign_bytes)
            if sign_file is not None:
                sign_file.write(sign_bytes)
            randomized_means = np.mean(signs * values[None, :], axis=1)
            exceedances += int(np.count_nonzero(randomized_means >= observed))

            remaining -= count
            assignment_start += count

        remaining = resamples
        while remaining:
            count = min(4096, remaining)
            indices = bootstrap_rng.integers(0, n, size=(count, n), dtype=np.uint32)
            index_bytes = indices.astype("<u4", copy=False).tobytes(order="C")
            index_hash.update(index_bytes)
            if index_file is not None:
                index_file.write(index_bytes)
            samples = values[indices]
            means = samples.mean(axis=1)
            deviations = samples.std(axis=1, ddof=1) / math.sqrt(n)
            numerators = means - observed
            statistics = np.empty(count, dtype=np.float64)
            ordinary = deviations > 0.0
            statistics[ordinary] = numerators[ordinary] / deviations[ordinary]
            zero = ~ordinary
            statistics[zero & (numerators > 0.0)] = math.inf
            statistics[zero & (numerators < 0.0)] = -math.inf
            statistics[zero & (numerators == 0.0)] = 0.0
            t_values.append(statistics)
            remaining -= count
    finally:
        if sign_file is not None:
            sign_file.close()
        if index_file is not None:
            index_file.close()

    ordered = np.sort(np.concatenate(t_values))
    lower_index = max(0, math.ceil(0.005 * resamples) - 1)
    upper_index = max(0, math.ceil(0.995 * resamples) - 1)
    q_lower = float(ordered[lower_index])
    q_upper = float(ordered[upper_index])
    if standard_error == 0.0:
        interval = [observed, observed]
    else:
        interval = [observed - q_upper * standard_error, observed - q_lower * standard_error]
    sign_randomization_p = (
        exceedances / sign_assignment_count
        if exact_sign_test
        else (1 + exceedances) / (sign_assignment_count + 1)
    )
    return {
        "analysis_version": ANALYSIS_VERSION,
        "n": n,
        "resamples": resamples,
        "mean_contrast": observed,
        "standard_error": standard_error,
        "sign_test_method": "exact-enumeration" if exact_sign_test else "monte-carlo-pcg64dxsm",
        "sign_test_assignment_count": sign_assignment_count,
        "sign_randomization_p": sign_randomization_p,
        "plus_one_sign_p": None if exact_sign_test else sign_randomization_p,
        "percentile_t_interval_99": interval,
        "sign_vectors_sha256": sign_hash.hexdigest(),
        "bootstrap_indices_sha256": index_hash.hexdigest(),
        "sign_vectors_persisted": persist_directory is not None,
        "bootstrap_indices_persisted": persist_directory is not None,
        "confirmatory_exact_resample_count": resamples == 100_000,
    }
