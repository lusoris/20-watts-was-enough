"""Evaluator-owned FM-T02 reference path, independent of simulator.py."""

from __future__ import annotations

import math
from typing import Any

import numpy as np

from generator import world_arrays

EVALUATOR_VERSION = "fixture-019.fm-t02-independent-evaluator.v1"
PRE_SHOCK_EQUITY = 240.0


def evaluate_truth(world: dict[str, Any], *, eta: float, funding_enabled: bool) -> dict[str, Any]:
    x, debt, p, supply = world_arrays(world)
    variance = float(world["u0"])
    equity_reference = float(world["reference_equity"])
    called = False
    call_count = 0
    scheduled_round = -1
    scheduled_amount = np.zeros(24, dtype=np.float64)
    worst_sale_residual = 0.0
    worst_balance_residual = 0.0
    previous_price_residual = math.inf
    previous_sale_fraction = math.inf
    floor_hit = False
    valid = True
    iteration = 0

    while iteration < 1000:
        marked_assets = np.einsum("ij,j->i", x, p)
        marked_equity = marked_assets - debt
        worst_balance_residual = max(
            worst_balance_residual,
            float(np.max(np.abs(marked_assets - debt - marked_equity))),
        )
        if funding_enabled and iteration >= 1 and not called and float(marked_equity.sum()) < 0.8 * equity_reference:
            called = True
            scheduled_round = iteration + 1
            scheduled_amount = 0.15 * debt.copy()

        ceiling = 12.0 / (1.0 + 5.0 * math.sqrt(max(0.0, variance)))
        need = np.empty(24, dtype=np.float64)
        for entity in range(24):
            if marked_equity[entity] <= 0.0:
                need[entity] = marked_assets[entity]
            else:
                need[entity] = max(0.0, marked_assets[entity] - ceiling * marked_equity[entity])
            need[entity] = min(marked_assets[entity], need[entity])
        previous_sale_fraction = max(
            float(need[entity] / max(marked_assets[entity], 1e-12)) for entity in range(24)
        )
        cash_call = scheduled_amount if scheduled_round == iteration else np.zeros(24, dtype=np.float64)
        if scheduled_round == iteration:
            scheduled_round = -1
            call_count += 1
        sell_value = np.minimum(marked_assets, need + cash_call)
        sold_units = np.zeros((24, 12), dtype=np.float64)
        for entity in range(24):
            if marked_assets[entity] > 0.0:
                sold_units[entity, :] = sell_value[entity] * x[entity, :] / marked_assets[entity]
        sale_check = np.einsum("ij,j->i", sold_units, p)
        worst_sale_residual = max(worst_sale_residual, float(np.max(np.abs(sale_check - sell_value))))
        x_after = x - sold_units
        debt_after = np.maximum(0.0, debt - sell_value)
        total_sold = sold_units.sum(axis=0)
        p_after = np.empty(12, dtype=np.float64)
        for asset in range(12):
            p_after[asset] = max(0.25, p[asset] * math.exp(-eta * total_sold[asset] / supply[asset]))
        floor_hit = floor_hit or bool(np.any(p_after <= 0.25))
        previous_price_residual = float(np.max(np.abs(p_after / p - 1.0)))
        old_market = float(np.dot(supply, p))
        new_market = float(np.dot(supply, p_after))
        log_return = math.log(new_market / old_market)
        variance = 0.94 * variance + 0.06 * log_return * log_return
        x, debt, p = x_after, debt_after, p_after
        iteration += 1

        if (
            not np.all(np.isfinite(x))
            or not np.all(np.isfinite(debt))
            or not np.all(np.isfinite(p))
            or np.min(x) < -1e-12
            or np.min(debt) < -1e-12
            or worst_sale_residual > 1e-8
        ):
            valid = False
            break
        if (
            previous_price_residual < 1e-8
            and previous_sale_fraction < 1e-8
            and scheduled_round < 0
            and (not funding_enabled or iteration >= 2)
        ):
            break

    converged = bool(
        valid
        and previous_price_residual < 1e-8
        and previous_sale_fraction < 1e-8
        and scheduled_round < 0
    )
    assets_end = np.einsum("ij,j->i", x, p)
    equity_end = assets_end - debt
    return {
        "evaluator_version": EVALUATOR_VERSION,
        "terminal_status": "ok" if valid else "hard_gate_failed",
        "delta_equity": float(PRE_SHOCK_EQUITY - equity_end.sum()),
        "terminal_equity": float(equity_end.sum()),
        "defaults": int(np.count_nonzero(equity_end <= 0.0)),
        "creditor_shortfall": float(np.maximum(0.0, debt - assets_end).sum()),
        "price_drawdown_percentage_points": float(100.0 * np.max(1.0 - p)),
        "sale_quantity_asset_units": float(np.sum(np.asarray(world["holdings"]) - x)),
        "rounds": iteration,
        "converged": converged,
        "funding_triggered": called,
        "funding_call_executed": bool(called and scheduled_round < 0),
        "funding_call_count": call_count,
        "price_floor_hit": floor_hit,
        "max_price_change": previous_price_residual,
        "max_required_sale_fraction": previous_sale_fraction,
        "max_sale_identity_residual_currency": worst_sale_residual,
        "max_balance_identity_residual_currency": worst_balance_residual,
        "terminal_prices": p.tolist(),
        "terminal_liabilities": debt.tolist(),
        "terminal_holdings_sha256_input": x.astype("<f8").tobytes(order="C").hex(),
    }
