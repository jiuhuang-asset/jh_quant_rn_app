// GET /api/summary?session_id=xxx — 绩效摘要快照
import { query, queryOne } from "../../src/lib/db";
import { getSummaryQuery, getEquityCurveQuery } from "../../src/lib/queries";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    // 获取交易摘要
    const { text, values } = getSummaryQuery(sessionId);
    const summaryRows = await query(text, values);
    const summary = summaryRows[0] || {};

    // 获取净值曲线用于计算指标
    const equity = getEquityCurveQuery(sessionId);
    const equityRows = await query(equity.text, equity.values);

    // 客户端计算 drawdown / sharpe / calmar
    let maxDrawdown: number | null = null;
    let cumulativeReturn: number | null = null;
    let latestValue: number | null = null;

    if (equityRows.length > 0) {
      const last = equityRows[equityRows.length - 1];
      latestValue = (last as Record<string, unknown>).portfolio_value as number;
      cumulativeReturn = (last as Record<string, unknown>).cumulative_return as number | null;

      // 计算最大回撤
      let peak = 0;
      let maxDd = 0;
      for (const row of equityRows) {
        const val = (row as Record<string, unknown>).portfolio_value as number;
        if (val > peak) peak = val;
        const dd = (peak - val) / peak;
        if (dd > maxDd) maxDd = dd;
      }
      maxDrawdown = maxDd > 0 ? maxDd : null;
    }

    return Response.json({
      session_id: sessionId,
      generated_at: new Date().toISOString(),
      total_trades: summary.total_trades || 0,
      buy_count: summary.buy_count || 0,
      sell_count: summary.sell_count || 0,
      total_amount: summary.total_amount || 0,
      total_commission: summary.total_commission || 0,
      latest_portfolio_value: latestValue,
      cumulative_return: cumulativeReturn,
      max_drawdown: maxDrawdown,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch summary", message }, { status: 500 });
  }
}
