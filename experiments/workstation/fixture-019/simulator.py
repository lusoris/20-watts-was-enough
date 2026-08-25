"""Deployable FM-T02 forecast implementations."""

from __future__ import annotations

import math
from typing import Any

import numpy as np

from generator import world_arrays

SIMULATOR_VERSION = "fixture-019.fm-t02-simulator.v1"
TOLERANCE = 1e-8
PRE_SHOCK_EQUITY = 24.0 * 10.0


def _finite_arrays(*arrays: np.ndarray) -> bool:
    return all(bool(np.all(np.isfinite(array))) for array in arrays)


def simulate_forecast(
    world: dict[str, Any],
    *,
    eta: float,
    funding_enabled: bool,
    one_pass: bool = False,
    staged_fraction: float = 1.0,
    max_rounds: int = 1000,
) -> dict[str, Any]:
    holdings, liabilities, prices, supply = world_arrays(world)
    u = float(world["u0"])
    reference_equity = float(world["reference_equity"])
    funding_triggered = False
    funding_call_count = 0
    call_due_round: int | None = None
    call_amounts: np.ndarray | None = None
    max_sale_identity = 0.0
    max_negative = 0.0
    max_balance_identity = 0.0
    max_price_change = math.inf
    max_required_fraction = math.inf
    floor_hit = False
    hard_gate_failed = False
    rounds = 0

    for round_index in range(max_rounds):
        opening_negative = max(
            max(0.0, -float(np.min(holdings))),
            max(0.0, -float(np.min(liabilities))),
        )
        if (
            not _finite_arrays(holdings, liabilities, prices, supply)
            or not math.isfinite(u)
            or opening_negative > 1e-12
            or bool(np.any(supply <= 0.0))
        ):
            max_negative = max(max_negative, opening_negative)
            max_price_change = 0.0
            max_required_fraction = 0.0
            hard_gate_failed = True
            rounds = round_index + 1
            break
        assets = holdings @ prices
        equity = assets - liabilities
        max_balance_identity = max(max_balance_identity, float(np.max(np.abs(assets - liabilities - equity))))

        if funding_enabled and round_index >= 1 and not funding_triggered:
            if float(np.sum(equity)) < 0.80 * reference_equity:
                funding_triggered = True
                call_due_round = round_index + 1
                call_amounts = 0.50 * (0.30 * liabilities.copy())

        volatility = math.sqrt(max(0.0, u))
        leverage_ceiling = 12.0 / (1.0 + 5.0 * volatility)
        required = np.where(
            equity <= 0.0,
            assets,
            np.maximum(0.0, assets - leverage_ceiling * equity),
        )
        required = np.minimum(assets, required)
        max_required_fraction = float(np.max(required / np.maximum(assets, 1e-12)))
        due = np.zeros(24, dtype=np.float64)
        if call_due_round == round_index and call_amounts is not None:
            due = call_amounts
            call_due_round = None
            funding_call_count += 1
        sales = np.minimum(assets, staged_fraction * required + due)
        quantities = np.divide(
            sales[:, None] * holdings,
            assets[:, None],
            out=np.zeros_like(holdings),
            where=assets[:, None] > 0.0,
        )
        realized_sales = np.sum(quantities * prices[None, :], axis=1)
        max_sale_identity = max(max_sale_identity, float(np.max(np.abs(realized_sales - sales))))
        holdings_next = holdings - quantities
        liabilities_next = np.maximum(0.0, liabilities - sales)
        aggregate_quantities = quantities.sum(axis=0)
        price_next = np.maximum(0.25, prices * np.exp(-eta * aggregate_quantities / supply))
        floor_hit = floor_hit or bool(np.any(price_next <= 0.25))
        max_price_change = float(np.max(np.abs(price_next / prices - 1.0)))

        market_before = float(np.dot(supply, prices))
        market_after = float(np.dot(supply, price_next))
        market_return = math.log(market_after / market_before)
        u = 0.94 * u + 0.06 * market_return * market_return
        holdings, liabilities, prices = holdings_next, liabilities_next, price_next
        rounds = round_index + 1
        max_negative = max(
            max_negative,
            max(0.0, -float(np.min(holdings))),
            max(0.0, -float(np.min(liabilities))),
        )
        if not _finite_arrays(holdings, liabilities, prices) or not math.isfinite(u):
            hard_gate_failed = True
            break
        if max_negative > 1e-12 or max_sale_identity > 1e-8:
            hard_gate_failed = True
            break
        if one_pass:
            break
        no_pending_call = call_due_round is None
        funding_observed = not funding_enabled or round_index >= 1
        if (
            max_price_change < TOLERANCE
            and max_required_fraction < TOLERANCE
            and no_pending_call
            and funding_observed
        ):
            break

    converged = (not one_pass) and (
        max_price_change < TOLERANCE
        and max_required_fraction < TOLERANCE
        and call_due_round is None
        and not hard_gate_failed
    )
    terminal_assets = holdings @ prices
    terminal_equity_vector = terminal_assets - liabilities
    terminal_equity = float(np.sum(terminal_equity_vector))
    return {
        "simulator_version": SIMULATOR_VERSION,
        "terminal_status": "hard_gate_failed" if hard_gate_failed else "ok",
        "delta_equity": float(PRE_SHOCK_EQUITY - terminal_equity),
        "terminal_equity": terminal_equity,
        "defaults": int(np.count_nonzero(terminal_equity_vector <= 0.0)),
        "creditor_shortfall": float(np.sum(np.maximum(0.0, liabilities - terminal_assets))),
        "price_drawdown_percentage_points": float(100.0 * np.max(1.0 - prices)),
        "sale_quantity_asset_units": float(np.sum(np.asarray(world["holdings"]) - holdings)),
        "rounds": rounds,
        "converged": bool(converged),
        "funding_triggered": funding_triggered,
        "funding_call_executed": bool(funding_triggered and call_due_round is None),
        "funding_call_count": funding_call_count,
        "price_floor_hit": floor_hit,
        "max_price_change": max_price_change,
        "max_required_sale_fraction": max_required_fraction,
        "max_sale_identity_residual_currency": max_sale_identity,
        "max_balance_identity_residual_currency": max_balance_identity,
        "max_negative_quantity": max_negative,
        "terminal_prices": prices.tolist(),
        "terminal_liabilities": liabilities.tolist(),
        "terminal_holdings_sha256_input": holdings.astype("<f8").tobytes(order="C").hex(),
    }


def forecast_arms(world: dict[str, Any], *, eta: float, funding_enabled: bool) -> dict[str, dict[str, Any]]:
    return {
        "zero-impact": simulate_forecast(world, eta=0.0, funding_enabled=False),
        "one-pass": simulate_forecast(world, eta=eta, funding_enabled=funding_enabled, one_pass=True),
        "full-fixed-point": simulate_forecast(world, eta=eta, funding_enabled=funding_enabled),
        "full-fixed-point-with-funding": simulate_forecast(world, eta=eta, funding_enabled=True),
        "staged-liquidation-fallback": simulate_forecast(
            world,
            eta=eta,
            # FM-T02 freezes the fallback as its own full-model restart.  It
            # therefore keeps the funding rule enabled even when the forecast
            # cell disables funding in the ordinary comparison arm.
            funding_enabled=True,
            staged_fraction=0.25,
        ),
    }
