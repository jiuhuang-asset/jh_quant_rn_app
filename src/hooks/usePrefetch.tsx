// ============================================================
// usePrefetch — 预热缓存: 当 sessions 数据就绪后预加载详情数据
// 原则: 一次多取(pre-fetch) | 不重复取 | 复用缓存
// ============================================================

import React, { useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPerformance } from "./usePerformance";
import { fetchPositions } from "./usePositions";
import { fetchSummary } from "./useSummary";
import { fetchSessions } from "./useSessions";
import type { SessionInfo } from "../lib/types";

/**
 * 当 sessions 列表加载完成后，预加载前 N 个 session 的详情数据。
 * TanStack Query cache 自动去重 —— 已缓存的不会重复请求。
 */
export function usePrefetchSessionData(
  sessions: SessionInfo[] | undefined,
  count = 2
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessions || sessions.length === 0) return;

    const targets = sessions.slice(0, count);

    for (const s of targets) {
      const sid = s.session_id;

      // prefetchQuery 只在缓存缺失或数据过期时才发起请求
      queryClient.prefetchQuery({
        queryKey: ["performance", sid],
        queryFn: () => fetchPerformance(sid),
      });

      queryClient.prefetchQuery({
        queryKey: ["positions", sid],
        queryFn: () => fetchPositions(sid),
      });

      queryClient.prefetchQuery({
        queryKey: ["summary", sid],
        queryFn: () => fetchSummary(sid),
      });
    }
  }, [sessions, count, queryClient]);
}

/**
 * 全局预加载 Provider — App 启动时自动拉取 sessions 并预热详情缓存。
 * 查询 key 共享，不会产生重复请求。
 */
export function PrefetchProvider({ children }: { children: ReactNode }) {
  const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  usePrefetchSessionData(sessions, 2);

  return <>{children}</>;
}
