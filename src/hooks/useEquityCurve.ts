// ============================================================
// useEquityCurve — 净值 + 回撤精简数据
// ============================================================

import { useQuery } from "@tanstack/react-query";
import type { EquityCurvePoint } from "../lib/types";
import { apiFetch } from "../lib/apiClient";

export async function fetchEquityCurve(sessionId: string): Promise<EquityCurvePoint[]> {
  const res = await apiFetch(`/api/equity?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error("Failed to fetch equity curve");
  return res.json();
}

export function useEquityCurve(sessionId: string | null) {
  return useQuery({
    queryKey: ["equity", sessionId],
    queryFn: () => fetchEquityCurve(sessionId!),
    enabled: !!sessionId,
  });
}
