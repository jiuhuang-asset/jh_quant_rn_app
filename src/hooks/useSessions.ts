// ============================================================
// useSessions — 投资组合列表
// ============================================================

import { useQuery } from "@tanstack/react-query";
import type { SessionInfo } from "../lib/types";
import { apiFetch } from "../lib/apiClient";

export async function fetchSessions(): Promise<SessionInfo[]> {
  const res = await apiFetch("/api/sessions");
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });
}
