// GET /api/positions?session_id=xxx — 最新持仓快照 + 权重计算
import { query } from "../../src/lib/db";
import { getPositionsQuery } from "../../src/lib/queries";

interface PositionRow {
  symbol: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  market_value: number;
  pnl: number | null;
  pnl_pct: number | null;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    const { text, values } = getPositionsQuery(sessionId);
    const rows = await query<PositionRow>(text, values);

    // 计算组合汇总
    const totalMarketValue = rows.reduce((sum, r) => sum + r.market_value, 0);
    const totalPnl = rows.reduce((sum, r) => sum + (r.pnl ?? 0), 0);

    const positions = rows.map((r) => ({
      ...r,
      weight: totalMarketValue > 0 ? r.market_value / totalMarketValue : 0,
    }));

    return Response.json({
      session_id: sessionId,
      generated_at: new Date().toISOString(),
      portfolio_value: totalMarketValue, // approximate: only position value
      position_value: totalMarketValue,
      total_pnl: totalPnl,
      num_positions: rows.length,
      positions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch positions", message }, { status: 500 });
  }
}
