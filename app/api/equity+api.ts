// GET /api/equity?session_id=xxx — 净值 + 回撤精简数据 (用于 sparkline)
import { getRequestConnectionString, query } from "../../src/lib/db";
import { getEquityCurveQuery } from "../../src/lib/queries";

interface EquityRow {
  trade_date: string;
  portfolio_value: number;
  cumulative_return: number | null;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    const { text, values } = getEquityCurveQuery(sessionId);
    const rows = await query<EquityRow>(text, values, getRequestConnectionString(request));

    // 精简字段 + 计算回撤
    let peak = 0;
    const result = rows.map((row) => {
      if (row.portfolio_value > peak) peak = row.portfolio_value;
      const drawdown = peak > 0 ? (peak - row.portfolio_value) / peak : 0;
      return {
        trade_date: row.trade_date,
        portfolio_value: row.portfolio_value,
        cumulative_return: row.cumulative_return,
        drawdown,
      };
    });

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch equity data", message }, { status: 500 });
  }
}
