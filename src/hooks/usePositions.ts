// ============================================================
// usePositions — 最新持仓快照
// ============================================================

import { useQuery } from "@tanstack/react-query";
import type { PositionsResponse } from "../lib/types";
import { apiFetch } from "../lib/apiClient";

export async function fetchPositions(sessionId: string): Promise<PositionsResponse> {
  const res = await apiFetch(`/api/positions?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error("Failed to fetch positions");
  return res.json();
}

export function usePositions(sessionId: string | null) {
  return useQuery({
    queryKey: ["positions", sessionId],
    queryFn: () => fetchPositions(sessionId!),
    enabled: !!sessionId,
  });
}
