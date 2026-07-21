// GET /api/trades?session_id=xxx&limit=20&offset=0&symbol=&trade_type= — 交易记录
import { query, queryOne } from "../../src/lib/db";
import { getTradesQuery, getTradesCountQuery } from "../../src/lib/queries";
import type { TradeRecord } from "../../src/lib/types";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const symbol = searchParams.get("symbol") || undefined;
    const tradeType = searchParams.get("trade_type") || undefined;

    // 并行查询数据和总数
    const [tradesQuery, countQuery] = [
      getTradesQuery(sessionId, limit, offset, symbol, tradeType),
      getTradesCountQuery(sessionId, symbol, tradeType),
    ];

    const [trades, countResult] = await Promise.all([
      query<TradeRecord>(tradesQuery.text, tradesQuery.values),
      queryOne<{ count: string }>(countQuery.text, countQuery.values),
    ]);

    const total = countResult ? parseInt(countResult.count, 10) : 0;

    return Response.json({
      session_id: sessionId,
      total,
      limit,
      offset,
      trades,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch trades", message }, { status: 500 });
  }
}
