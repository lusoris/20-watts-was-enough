"""Deterministic FM-T02 world generation using NumPy PCG64DXSM."""

from __future__ import annotations

import hashlib
import json
from typing import Any

import numpy as np

GENERATOR_VERSION = "fixture-019.fm-t02-generator.v1"
UINT64_MAX = (1 << 64) - 1


def canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False)


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def protocol_seed(split: str, regime: str, replicate: int) -> int:
    """Return the low 64 bits of the canonical FM-v1 seed digest."""
    label = f"FM-v1|FM-T02|{split}|{regime}|{replicate}"
    digest = hashlib.sha256(label.encode("utf-8")).digest()
    return int.from_bytes(digest[-8:], "big", signed=False)


def validate_seed(seed: str) -> int:
    if not isinstance(seed, str) or not seed.isdigit() or (len(seed) > 1 and seed[0] == "0"):
        raise ValueError("FM-T02 seeds must be canonical unsigned decimal strings")
    parsed = int(seed)
    if parsed < 0 or parsed > UINT64_MAX:
        raise ValueError("FM-T02 seed exceeds uint64")
    return parsed


def generate_world(seed: str, common_share: float) -> dict[str, Any]:
    seed_value = validate_seed(seed)
    if common_share not in (0.35, 0.85):
        raise ValueError("FM-T02 common share must be 0.35 or 0.85")
    rng = np.random.Generator(np.random.PCG64DXSM(seed_value))
    theta = rng.dirichlet(np.full(11, 1.5, dtype=np.float64), size=24).astype("<f8")
    weights = np.empty((24, 12), dtype="<f8")
    weights[:, 0] = common_share
    weights[:, 1:] = (1.0 - common_share) * theta
    holdings = (120.0 * weights).astype("<f8")
    prices_pre = np.ones(12, dtype="<f8")
    prices_zero = np.full(12, 0.98, dtype="<f8")
    prices_zero[0] = 0.95
    liabilities = np.full(24, 110.0, dtype="<f8")
    supply = holdings.sum(axis=0).astype("<f8")
    r0 = float(np.log(np.dot(supply, prices_zero) / np.dot(supply, prices_pre)))
    u0 = float(0.06 * r0 * r0)
    reference_equity = float(np.sum(holdings @ prices_zero - liabilities))
    generated_arrays = b"".join([
        theta.tobytes(order="C"),
        weights.tobytes(order="C"),
        holdings.tobytes(order="C"),
    ])
    body = {
        "schema": 1,
        "generator_version": GENERATOR_VERSION,
        "numpy_version": np.__version__,
        "bit_generator": "PCG64DXSM",
        "seed_uint64": seed,
        "common_share": common_share,
        "theta": theta.tolist(),
        "weights": weights.tolist(),
        "holdings": holdings.tolist(),
        "liabilities": liabilities.tolist(),
        "prices_pre": prices_pre.tolist(),
        "prices_zero": prices_zero.tolist(),
        "supply": supply.tolist(),
        "r0": r0,
        "u0": u0,
        "reference_equity": reference_equity,
        "generated_arrays_sha256": hashlib.sha256(generated_arrays).hexdigest(),
    }
    return {**body, "world_sha256": sha256_text(canonical_json(body))}


def world_arrays(world: dict[str, Any]) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    holdings = np.asarray(world["holdings"], dtype=np.float64)
    liabilities = np.asarray(world["liabilities"], dtype=np.float64)
    prices = np.asarray(world["prices_zero"], dtype=np.float64)
    supply = np.asarray(world["supply"], dtype=np.float64)
    if holdings.shape != (24, 12) or liabilities.shape != (24,) or prices.shape != (12,):
        raise ValueError("FM-T02 world has an invalid shape")
    return holdings.copy(), liabilities.copy(), prices.copy(), supply.copy()
