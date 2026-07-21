// ============================================================
// Root Layout — QueryClientProvider + Stack 导航 + 全局预加载
// ============================================================

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "../src/hooks/queryClient";
import { PrefetchProvider } from "../src/hooks/usePrefetch";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <PrefetchProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="session/[id]"
            options={{
              title: "会话详情",
              headerBackTitle: "返回",
              headerStyle: { backgroundColor: "#0A2342" },
              headerTintColor: "#FFFFFF",
            }}
          />
        </Stack>
      </PrefetchProvider>
    </QueryClientProvider>
  );
}
