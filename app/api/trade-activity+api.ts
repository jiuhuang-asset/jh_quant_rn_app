// GET /api/trade-activity?session_id=xxx — 每日交易活跃度
import { query } from "../../src/lib/db";
import { getTradeActivityQuery } from "../../src/lib/queries";
import type { TradeActivityPoint } from "../../src/lib/types";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    const { text, values } = getTradeActivityQuery(sessionId);
    const rows = await query<TradeActivityPoint>(text, values);

    return Response.json(rows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "Failed to fetch trade activity", message },
      { status: 500 }
    );
  }
}
