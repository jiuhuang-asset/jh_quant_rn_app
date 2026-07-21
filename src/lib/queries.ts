// ============================================================
// SQL 查询构建器 — 对应 jh_quant/trading/persistence/models.py 7 表
// ============================================================

// ——— 1. Session 列表 (各投资组合) ———

export function getSessionsQuery() {
  return {
    text: `
      SELECT DISTINCT ON (s.session_id)
        s.session_id,
        s.session_id AS session_name,
        COALESCE(
          s.state_data #>> '{session,config,execution_mode}',
          s.state_data->>'execution_mode'
        ) AS mode,
        s.export_time AS latest_export_time,
        p.portfolio_value AS current_value,
        p.cumulative_return AS total_return,
        p.daily_pnl,
        p.num_positions AS position_count,
        p.trade_date AS latest_date,
        COALESCE(tc.total_trades, 0)::int AS total_trades,
        tc.win_rate,
        COALESCE(dd.max_drawdown, 0)::float AS max_drawdown,
        COALESCE(dd.total_pnl, 0)::float AS total_pnl,
        (s.state_data #>> '{session,config,initial_capital}')::float AS initial_capital,
        s.state_data -> 'session' -> 'strategy_specs' AS strategy_specs_json
      FROM session_runtime_states s
      LEFT JOIN LATERAL (
        SELECT portfolio_value, cumulative_return, daily_pnl,
               num_positions, trade_date
        FROM daily_performances
        WHERE session_id = s.session_id
        ORDER BY trade_date DESC
        LIMIT 1
      ) p ON true
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::int AS total_trades,
          CASE
            WHEN COUNT(*) FILTER (WHERE trade_type = 'SELL') > 0
            THEN ROUND(
              COUNT(*) FILTER (
                WHERE trade_type = 'SELL'
                  AND amount > COALESCE(
                    (SELECT AVG(amount) FROM trades t2
                     WHERE t2.session_id = s.session_id AND t2.trade_type = 'BUY'),
                    0
                  )
              )::numeric
              / NULLIF(COUNT(*) FILTER (WHERE trade_type = 'SELL'), 0)::numeric,
              4
            )
            ELSE NULL
          END AS win_rate
        FROM trades
        WHERE session_id = s.session_id
      ) tc ON true
      LEFT JOIN LATERAL (
        SELECT
          MAX(dd) AS max_drawdown,
          SUM(daily_pnl) AS total_pnl
        FROM (
          SELECT
            trade_date,
            daily_pnl,
            portfolio_value,
            CASE
              WHEN MAX(portfolio_value) OVER (
                PARTITION BY session_id ORDER BY trade_date
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              ) > 0
              THEN (MAX(portfolio_value) OVER (
                PARTITION BY session_id ORDER BY trade_date
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              ) - portfolio_value)
              / NULLIF(MAX(portfolio_value) OVER (
                PARTITION BY session_id ORDER BY trade_date
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              ), 0)
              ELSE 0
            END AS dd
          FROM daily_performances
          WHERE session_id = s.session_id
        ) sub
      ) dd ON true
      ORDER BY s.session_id, s.export_time DESC
    `,
    values: [] as unknown[],
  };
}

// ——— 2. 净值曲线 (equity curve) ———

export function getEquityCurveQuery(sessionId: string) {
  return {
    text: `
      SELECT trade_date, portfolio_value, cash_balance,
             position_value, daily_return, cumulative_return,
             daily_pnl, num_positions
      FROM daily_performances
      WHERE session_id = $1
      ORDER BY trade_date ASC
    `,
    values: [sessionId],
  };
}

// ——— 3. 最新持仓 ———

export function getPositionsQuery(sessionId: string) {
  return {
    text: `
      SELECT symbol, quantity, avg_cost, current_price,
             market_value, pnl, pnl_pct
      FROM positions_snapshot
      WHERE session_id = $1
        AND trade_date = (
          SELECT MAX(trade_date) FROM positions_snapshot
          WHERE session_id = $1
        )
      ORDER BY market_value DESC
    `,
    values: [sessionId],
  };
}

// ——— 4. 交易记录 (分页) ———

export function getTradesQuery(
  sessionId: string,
  limit: number = 20,
  offset: number = 0,
  symbol?: string,
  tradeType?: string
) {
  const conditions: string[] = ["session_id = $1"];
  const values: unknown[] = [sessionId];
  let paramIdx = 2;

  if (symbol) {
    conditions.push(`symbol ILIKE $${paramIdx++}`);
    values.push(`%${symbol}%`);
  }
  if (tradeType) {
    conditions.push(`trade_type = $${paramIdx++}`);
    values.push(tradeType);
  }

  const where = conditions.join(" AND ");
  const limitP = paramIdx++;
  const offsetP = paramIdx++;
  values.push(limit, offset);

  return {
    text: `
      SELECT trade_id, session_id, trade_date, symbol, trade_type,
             price, quantity, amount, commission, slippage,
             total_cost, signal_reason, order_id
      FROM trades
      WHERE ${where}
      ORDER BY trade_date DESC
      LIMIT $${limitP} OFFSET $${offsetP}
    `,
    values,
  };
}

/** 交易总数 (用于分页) */
export function getTradesCountQuery(
  sessionId: string,
  symbol?: string,
  tradeType?: string
) {
  const conditions: string[] = ["session_id = $1"];
  const values: unknown[] = [sessionId];
  let paramIdx = 2;

  if (symbol) {
    conditions.push(`symbol ILIKE $${paramIdx++}`);
    values.push(`%${symbol}%`);
  }
  if (tradeType) {
    conditions.push(`trade_type = $${paramIdx++}`);
    values.push(tradeType);
  }

  return {
    text: `SELECT COUNT(*) AS count FROM trades WHERE ${conditions.join(" AND ")}`,
    values,
  };
}

// ——— 5. 绩效摘要 (KPI) ———

export function getSummaryQuery(sessionId: string) {
  return {
    text: `
      SELECT
        COUNT(*) FILTER (WHERE trade_type = 'BUY') AS buy_count,
        COUNT(*) FILTER (WHERE trade_type = 'SELL') AS sell_count,
        COUNT(*) AS total_trades,
        COALESCE(SUM(amount), 0) AS total_amount,
        COALESCE(SUM(commission), 0) AS total_commission
      FROM trades
      WHERE session_id = $1
    `,
    values: [sessionId],
  };
}

// ——— 6. 每日交易活跃度 ———

export function getTradeActivityQuery(sessionId: string) {
  return {
    text: `
      SELECT
        trade_date::date AS trade_date,
        COUNT(*) AS trade_count,
        COUNT(*) FILTER (WHERE trade_type = 'BUY') AS buy_count,
        COUNT(*) FILTER (WHERE trade_type = 'SELL') AS sell_count,
        COALESCE(SUM(amount) FILTER (WHERE trade_type = 'BUY'), 0) AS buy_amount,
        COALESCE(SUM(amount) FILTER (WHERE trade_type = 'SELL'), 0) AS sell_amount,
        COALESCE(SUM(amount) FILTER (WHERE trade_type = 'BUY'), 0)
          - COALESCE(SUM(amount) FILTER (WHERE trade_type = 'SELL'), 0) AS net_amount
      FROM trades
      WHERE session_id = $1
      GROUP BY trade_date::date
      ORDER BY trade_date::date ASC
    `,
    values: [sessionId],
  };
}

// ——— 7. 盈亏来源分解 ———

export function getPnlSourceQuery(sessionId: string) {
  return {
    text: `
      SELECT
        symbol,
        SUM(CASE WHEN trade_type = 'SELL' THEN amount ELSE 0 END)
          - SUM(CASE WHEN trade_type = 'BUY' THEN amount ELSE 0 END) AS realized_pnl,
        COUNT(*) AS closed_trade_count,
        COUNT(*) FILTER (
          WHERE trade_type = 'SELL'
            AND amount > (
              SELECT AVG(amount) FROM trades t2
              WHERE t2.symbol = trades.symbol AND t2.session_id = $1 AND t2.trade_type = 'BUY'
            )
        ) AS win_trade_count,
        COUNT(*) FILTER (
          WHERE trade_type = 'SELL'
            AND amount <= (
              SELECT AVG(amount) FROM trades t2
              WHERE t2.symbol = trades.symbol AND t2.session_id = $1 AND t2.trade_type = 'BUY'
            )
        ) AS loss_trade_count
      FROM trades
      WHERE session_id = $1
      GROUP BY symbol
      ORDER BY realized_pnl DESC
    `,
    values: [sessionId],
  };
}

// ——— 8. 仓位权重历史 ———

export function getPositionWeightsQuery(sessionId: string) {
  return {
    text: `
      SELECT trade_date, symbol, market_value,
             CASE WHEN SUM(market_value) OVER (PARTITION BY trade_date) > 0
                  THEN market_value / SUM(market_value) OVER (PARTITION BY trade_date)
                  ELSE 0 END AS weight
      FROM positions_snapshot
      WHERE session_id = $1
      ORDER BY trade_date, symbol
    `,
    values: [sessionId],
  };
}
