// GET /api/sessions — 投资组合列表
import { query } from "../../src/lib/db";
import { getSessionsQuery } from "../../src/lib/queries";

interface SessionRow {
  session_id: string;
  session_name: string;
  mode: string | null;
  latest_export_time: string;
  current_value: number | null;
  total_return: number | null;
  daily_pnl: number | null;
  position_count: number;
  latest_date: string | null;
  total_trades: number;
  win_rate: number | null;
  max_drawdown: number;
  total_pnl: number;
  initial_capital: number | null;
  strategy_specs_json: unknown;
}

/** Extract strategy names from strategy_specs JSON array */
function extractStrategyNames(specsJson: unknown): string[] {
  if (!specsJson || !Array.isArray(specsJson)) return [];
  return specsJson
    .map((spec: Record<string, unknown>) =>
      (spec.alias as string) || (spec.name as string) || ""
    )
    .filter(Boolean);
}

export async function GET(): Promise<Response> {
  try {
    const { text, values } = getSessionsQuery();
    const rows = await query<SessionRow>(text, values);

    // Post-process: extract strategy names, compute running status
    const sessions = rows.map((row) => ({
      session_id: row.session_id,
      mode: row.mode ?? "paper",
      session_name: row.session_name || row.session_id,
      initial_capital: row.initial_capital ?? undefined,
      current_value: row.current_value,
      total_return: row.total_return,
      daily_pnl: row.daily_pnl,
      position_count: row.position_count ?? 0,
      max_drawdown: row.max_drawdown,
      win_rate: row.win_rate,
      total_trades: row.total_trades ?? 0,
      total_pnl: row.total_pnl,
      latest_date: row.latest_date,
      strategy_names: extractStrategyNames(row.strategy_specs_json),
    }));

    return Response.json(sessions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch sessions", message }, { status: 500 });
  }
}
