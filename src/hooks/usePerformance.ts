// ============================================================
// usePerformance — 净值曲线 (equity curve + drawdown)
// ============================================================

import { useQuery } from "@tanstack/react-query";
import type { PerformancePoint } from "../lib/types";

export async function fetchPerformance(sessionId: string): Promise<PerformancePoint[]> {
  const res = await fetch(`/api/performance?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error("Failed to fetch performance");
  return res.json();
}

export function usePerformance(sessionId: string | null) {
  return useQuery({
    queryKey: ["performance", sessionId],
    queryFn: () => fetchPerformance(sessionId!),
    enabled: !!sessionId,
  });
}
