// ============================================================
// usePositions — 最新持仓快照
// ============================================================

import { useQuery } from "@tanstack/react-query";
import type { PositionsResponse } from "../lib/types";

export async function fetchPositions(sessionId: string): Promise<PositionsResponse> {
  const res = await fetch(`/api/positions?session_id=${encodeURIComponent(sessionId)}`);
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
