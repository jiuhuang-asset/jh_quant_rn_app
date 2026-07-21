// ============================================================
// useTrades — 交易记录 (分页 + 筛选)
// ============================================================

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { TradesResponse } from "../lib/types";

interface TradeFilters {
  symbol?: string;
  tradeType?: string;
}

export async function fetchTrades(
  sessionId: string,
  page: number,
  pageSize: number,
  filters: TradeFilters
): Promise<TradesResponse> {
  const params = new URLSearchParams({
    session_id: sessionId,
    limit: String(pageSize),
    offset: String((page - 1) * pageSize),
  });
  if (filters.symbol) params.set("symbol", filters.symbol);
  if (filters.tradeType) params.set("trade_type", filters.tradeType);

  const res = await fetch(`/api/trades?${params}`);
  if (!res.ok) throw new Error("Failed to fetch trades");
  return res.json();
}

export function useTrades(
  sessionId: string | null,
  page: number = 1,
  pageSize: number = 20,
  filters: TradeFilters = {}
) {
  return useQuery({
    queryKey: ["trades", sessionId, page, pageSize, filters],
    queryFn: () => fetchTrades(sessionId!, page, pageSize, filters),
    enabled: !!sessionId,
    placeholderData: keepPreviousData,
  });
}
