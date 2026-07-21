// ============================================================
// @jh-quant/shared — 共享类型定义 (本地)
// 数据源: jh_quant/trading/persistence/models.py (7 表)
//         jh_quant/trading/service/schemas.py (API 响应模型)
// ============================================================

// ——— 枚举 ———

export type ExecutionMode = "paper" | "live";
export type TradeType = "BUY" | "SELL";
export type Frequency = "1d" | "1min" | "5min" | "15min" | "30min" | "60min" | "1hour";

// ——— 数据库行类型 ———

/** trades 表 */
export interface TradeRecord {
  trade_id: string;
  session_id: string;
  trade_date: string;
  symbol: string;
  trade_type: TradeType;
  price: number;
  quantity: number;
  amount: number;
  commission: number;
  slippage: number;
  total_cost: number;
  signal_reason: string | null;
  order_id: string | null;
  created_at: string;
}

/** daily_performances 表 */
export interface DailyPerformance {
  performance_id: string;
  session_id: string;
  trade_date: string;
  portfolio_value: number;
  cash_balance: number;
  position_value: number;
  daily_return: number | null;
  cumulative_return: number | null;
  daily_pnl: number | null;
  num_positions: number;
  created_at: string;
}

/** positions_snapshot 表 */
export interface PositionSnapshot {
  snapshot_id: string;
  session_id: string;
  trade_date: string;
  symbol: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  market_value: number;
  pnl: number | null;
  pnl_pct: number | null;
  created_at: string;
}

// ——— API 响应类型 ———

/** GET /api/sessions */
export interface SessionInfo {
  session_id: string;
  mode: ExecutionMode;
  session_name: string;
  initial_capital?: number;
  current_value: number | null;
  total_return: number | null;
  daily_pnl: number | null;
  position_count: number;
  max_drawdown: number | null;
  win_rate: number | null;
  total_trades: number;
  total_pnl: number | null;
  latest_date: string | null;
  strategy_names: string[];
}

export type SessionsResponse = SessionInfo[];

/** GET /api/performance */
export interface PerformancePoint {
  trade_date: string;
  portfolio_value: number;
  cash_balance: number;
  position_value: number;
  daily_return: number | null;
  cumulative_return: number | null;
  daily_pnl: number | null;
  num_positions: number;
  drawdown?: number | null;
}

export type PerformanceResponse = PerformancePoint[];

/** GET /api/positions */
export interface PositionDetail {
  symbol: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  market_value: number;
  pnl: number | null;
  pnl_pct: number | null;
  weight: number | null;
}

export interface PositionsResponse {
  session_id: string;
  generated_at: string;
  portfolio_value: number;
  cash_balance?: number;
  position_value: number;
  total_pnl: number | null;
  num_positions: number;
  positions: PositionDetail[];
}

/** GET /api/trades */
export interface TradesResponse {
  session_id: string;
  total: number;
  limit: number;
  offset: number;
  trades: TradeRecord[];
}

/** GET /api/equity */
export interface EquityCurvePoint {
  trade_date: string;
  portfolio_value: number;
  cumulative_return: number | null;
  drawdown: number | null;
}

export type EquityCurveResponse = EquityCurvePoint[];

/** GET /api/summary */
export interface PerformanceSummary {
  session_id: string;
  generated_at: string;
  total_return: number | null;
  annualized_return: number | null;
  cumulative_return: number | null;
  max_drawdown: number | null;
  sharpe_ratio: number | null;
  calmar_ratio: number | null;
  volatility: number | null;
  total_trades: number;
  win_rate: number | null;
  avg_win: number | null;
  avg_loss: number | null;
  profit_factor: number | null;
  latest_portfolio_value: number | null;
  latest_cash_balance: number | null;
  latest_position_value: number | null;
}

// ——— 其他 ———

export interface PnlSourceItem {
  symbol: string;
  realized_pnl: number;
  closed_trade_count: number;
  win_trade_count: number;
  loss_trade_count: number;
  contribution_ratio: number | null;
}

export interface TurnoverPoint {
  trade_date: string;
  position_value: number;
  portfolio_value: number;
  trade_amount: number;
  turnover_ratio: number | null;
}

export interface TradeActivityPoint {
  trade_date: string;
  trade_count: number;
  buy_count: number;
  sell_count: number;
  buy_amount: number;
  sell_amount: number;
  net_amount: number;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}
