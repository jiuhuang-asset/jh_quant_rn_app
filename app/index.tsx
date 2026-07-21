// ============================================================
// 根路由 → 重定向到 Dashboard
// ============================================================

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/dashboard" />;
}
