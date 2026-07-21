// ============================================================
// Dashboard 页面 — 总览仪表盘
// KPI 卡片网格 + Session 列表
// 支持 模拟盘/实盘 模式切换
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSessions } from "../../src/hooks/useSessions";
import { usePrefetchSessionData } from "../../src/hooks/usePrefetch";
import { StatCard } from "../../src/components/cards/StatCard";
import { SessionCard } from "../../src/components/cards/SessionCard";
import { ListSkeleton } from "../../src/components/layout/LoadingSkeleton";
import { colors, spacing, radius, typography, shadow } from "../../src/theme/theme";
import { upDownColor } from "../../src/utils/colors";
import { formatCurrency, formatPercent } from "../../src/utils/format";
import type { ExecutionMode, SessionInfo } from "../../src/lib/types";

type ModeFilter = "all" | "paper" | "live";

const MODE_OPTIONS: { key: ModeFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "paper", label: "模拟盘" },
  { key: "live", label: "实盘" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_GAP = spacing[3];

export default function DashboardScreen() {
  const router = useRouter();
  const { data: sessions, isLoading, isError, refetch } = useSessions();

  // ---- 预加载详情数据 (pre-fetch: sessions 就绪后自动预热缓存) ----
  usePrefetchSessionData(sessions, 2);

  // ---- 模式筛选 ----
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    if (modeFilter === "all") return sessions;
    return sessions.filter((s) => s.mode === modeFilter);
  }, [sessions, modeFilter]);

  // 各模式 session 数量
  const modeCounts = useMemo(() => {
    if (!sessions) return { paper: 0, live: 0 };
    return {
      paper: sessions.filter((s) => s.mode === "paper").length,
      live: sessions.filter((s) => s.mode === "live").length,
    };
  }, [sessions]);

  // ---- 汇总 KPI (仅基于过滤后的 sessions) ----
  const summaryKpis = useMemo(() => {
    if (!filteredSessions || filteredSessions.length === 0) return null;

    const list = filteredSessions;
    const totalValue = list.reduce((sum, s) => sum + (s.current_value ?? 0), 0);
    const totalPnl = list.reduce((sum, s) => sum + (s.total_pnl ?? 0), 0);
    const avgReturn =
      list.length > 0
        ? list.reduce((sum, s) => sum + (s.total_return ?? 0), 0) / list.length
        : 0;
    const maxDd =
      list.length > 0
        ? Math.min(...list.map((s) => s.max_drawdown ?? Infinity))
        : 0;
    const maxDdVal = maxDd === Infinity ? null : maxDd;

    const labelPrefix = modeFilter === "all" ? "" : modeFilter === "paper" ? "模拟" : "实盘";

    return [
      {
        label: `${labelPrefix}总资产`,
        value: formatCurrency(totalValue, 0),
        change: null,
        icon: "wallet" as const,
      },
      {
        label: `${labelPrefix}总盈亏`,
        value: formatCurrency(totalPnl, 0),
        change: null,
        icon: "trending-up" as const,
      },
      {
        label: `${labelPrefix}平均收益`,
        value: formatPercent(avgReturn),
        change: avgReturn,
        icon: "analytics" as const,
      },
      {
        label: `${labelPrefix}最大回撤`,
        value: maxDdVal != null ? formatPercent(maxDdVal) : "--",
        change: null,
        icon: "arrow-down" as const,
      },
    ];
  }, [filteredSessions, modeFilter]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={colors.primary[500]}
        />
      }
    >
      {/* ---- 模式切换按钮 ---- */}
      <View style={styles.segmentRow}>
        {MODE_OPTIONS.map((opt) => {
          const active = modeFilter === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.segmentBtn, active && styles.segmentBtnActive]}
              onPress={() => setModeFilter(opt.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {opt.label}
              </Text>
              {opt.key !== "all" && (
                <Text
                  style={[
                    styles.segmentCount,
                    active && styles.segmentCountActive,
                  ]}
                >
                  {modeCounts[opt.key as "paper" | "live"]}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ---- KPI 卡片行 ---- */}
      {summaryKpis && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiRow}
        >
          {summaryKpis.map((kpi, i) => (
            <StatCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              isLoading={isLoading}
            />
          ))}
        </ScrollView>
      )}

      {/* 无数据提示 */}
      {filteredSessions.length === 0 && !isLoading && (
        <View style={styles.emptyBanner}>
          <Ionicons name="information-circle-outline" size={20} color={colors.gray[400]} />
          <Text style={styles.emptyBannerText}>
            {modeFilter === "all" ? "暂无投资组合" : `暂无${modeFilter === "paper" ? "模拟盘" : "实盘"}组合`}
          </Text>
        </View>
      )}

      {/* Error 状态 */}
      {isError && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning" size={20} color={colors.warning} />
          <Text style={styles.errorText}>数据加载失败，下拉刷新重试</Text>
        </View>
      )}

      {/* ---- Session 列表标题 ---- */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>投资组合</Text>
        <Text style={styles.sectionCount}>
          {filteredSessions.length} 个
        </Text>
      </View>

      {/* ---- Session 卡片列表 ---- */}
      {isLoading ? (
        <ListSkeleton rows={3} variant="card" />
      ) : filteredSessions.length > 0 ? (
        <View style={styles.sessionList}>
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.session_id}
              session={session}
              onPress={() =>
                router.push(`/session/${session.session_id}`)
              }
            />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

// ---- Styles ----

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing[4],
    gap: spacing[4],
    paddingBottom: spacing[12],
  },

  /* ---- Segment Control ---- */
  segmentRow: {
    flexDirection: "row",
    backgroundColor: colors.gray[100],
    borderRadius: radius.md,
    padding: 3,
    gap: 2,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radius.sm + 1,
    gap: 4,
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    ...shadow.sm,
  },
  segmentText: {
    ...typography.caption,
    fontWeight: "500",
    color: colors.gray[500],
  },
  segmentTextActive: {
    color: colors.primary[500],
    fontWeight: "600",
  },
  segmentCount: {
    fontSize: 10,
    color: colors.gray[400],
    backgroundColor: colors.gray[200],
    borderRadius: radius.full,
    paddingHorizontal: 5,
    paddingVertical: 1,
    overflow: "hidden",
    minWidth: 18,
    textAlign: "center",
  },
  segmentCountActive: {
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
  },

  /* ---- KPI Row ---- */
  kpiRow: {
    gap: CARD_GAP,
    paddingRight: spacing[4],
  },

  /* ---- Empty / Error ---- */
  emptyBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    backgroundColor: colors.gray[50],
    padding: spacing[3],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  emptyBannerText: {
    ...typography.caption,
    color: colors.gray[500],
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    backgroundColor: colors.warning + "15",
    padding: spacing[3],
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  errorText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
  },

  /* ---- Section Header ---- */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.gray[800],
  },
  sectionCount: {
    ...typography.caption,
    color: colors.gray[500],
  },

  /* ---- Session List ---- */
  sessionList: {
    gap: spacing[3],
  },
});
