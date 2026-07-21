// ============================================================
// TanStack Query Client 单例 — 新加坡 DB 优化
// staleTime: 5min (数据新鲜期内不重复请求)
// gcTime: 30min (缓存保留期，页面切换复用)
// ============================================================

import { QueryClient } from "@tanstack/react-query";
import { STALE_TIME, GC_TIME } from "../utils/constants";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
