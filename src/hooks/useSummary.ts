// ============================================================
// useSummary — 绩效摘要快照
// ============================================================

import { useQuery } from "@tanstack/react-query";
import type { PerformanceSummary } from "../lib/types";

export async function fetchSummary(sessionId: string): Promise<PerformanceSummary> {
  const res = await fetch(`/api/summary?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export function useSummary(sessionId: string | null) {
  return useQuery({
    queryKey: ["summary", sessionId],
    queryFn: () => fetchSummary(sessionId!),
    enabled: !!sessionId,
  });
}
