// GET /api/performance?session_id=xxx — 净值曲线 + 回撤数据
import { query } from "../../src/lib/db";
import { getEquityCurveQuery } from "../../src/lib/queries";

interface PerformanceRow {
  trade_date: string;
  portfolio_value: number;
  cash_balance: number;
  position_value: number;
  daily_return: number | null;
  cumulative_return: number | null;
  daily_pnl: number | null;
  num_positions: number;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    const { text, values } = getEquityCurveQuery(sessionId);
    const rows = await query<PerformanceRow>(text, values);

    // 计算回撤 (drawdown)
    let peak = 0;
    const result = rows.map((row) => {
      if (row.portfolio_value > peak) peak = row.portfolio_value;
      const drawdown = peak > 0 ? (peak - row.portfolio_value) / peak : 0;
      return { ...row, drawdown };
    });

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch performance", message }, { status: 500 });
  }
}
