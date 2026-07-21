// ============================================================
// useTradeActivity — 每日交易活跃度
// ============================================================

import { useQuery } from "@tanstack/react-query";
import type { TradeActivityPoint } from "../lib/types";
import { apiFetch } from "../lib/apiClient";

export async function fetchTradeActivity(sessionId: string): Promise<TradeActivityPoint[]> {
  const res = await apiFetch(`/api/trade-activity?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error("Failed to fetch trade activity");
  return res.json();
}

export function useTradeActivity(sessionId: string | null) {
  return useQuery({
    queryKey: ["tradeActivity", sessionId],
    queryFn: () => fetchTradeActivity(sessionId!),
    enabled: !!sessionId,
  });
}
