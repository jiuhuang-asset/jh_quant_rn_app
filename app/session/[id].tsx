// ============================================================
// Session Detail 页面 — 深度分析
// 净值曲线 + 持仓构成 + 交易活跃度 + 月度收益热力图
// ============================================================

import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSessions } from "../../src/hooks/useSessions";
import { useSummary } from "../../src/hooks/useSummary";
import { usePerformance } from "../../src/hooks/usePerformance";
import { usePositions } from "../../src/hooks/usePositions";
import { useTradeActivity } from "../../src/hooks/useTradeActivity";
import { StatCard } from "../../src/components/cards/StatCard";
import { EquityCurve } from "../../src/components/charts/EquityCurve";
import { PositionComposition } from "../../src/components/charts/PositionComposition";
import { TradeActivityChart } from "../../src/components/charts/TradeActivity";
import { PositionsTable } from "../../src/components/tables/PositionsTable";
import { ListSkeleton } from "../../src/components/layout/LoadingSkeleton";
import { colors, spacing, radius, typography, shadow } from "../../src/theme/theme";
import { formatCurrency, formatPercent } from "../../src/utils/format";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionId = id ?? "";

  const { data: summary, isLoading: summaryLoading } = useSummary(sessionId);
  const { data: performance, isLoading: perfLoading } = usePerformance(sessionId);
  const { data: positionsData, isLoading: posLoading } = usePositions(sessionId);
  const { data: tradeActivity, isLoading: activityLoading } = useTradeActivity(sessionId);

  const isLoading = summaryLoading || perfLoading || posLoading || activityLoading;

  // KPI 指标
  const kpis = useMemo(() => {
    if (!summary) return null;
    return [
      { label: "累计收益", value: formatPercent(summary.cumulative_return ?? 0), change: summary.cumulative_return },
      { label: "最大回撤", value: summary.max_drawdown != null ? formatPercent(summary.max_drawdown) : "--", change: null },
      { label: "总交易数", value: String(summary.total_trades), change: null },
      { label: "最新净值", value: summary.latest_portfolio_value != null ? formatCurrency(summary.latest_portfolio_value, 0) : "--", change: null },
    ];
  }, [summary]);

  // 月度收益热力图数据
  const monthlyReturns = useMemo(() => {
    if (!performance || performance.length === 0) return null;

    const monthlyMap: Record<string, { returns: number[]; pnl: number }> = {};
    for (const p of performance) {
      const month = p.trade_date.slice(0, 7); // "2026-07"
      if (!monthlyMap[month]) monthlyMap[month] = { returns: [], pnl: 0 };
      if (p.daily_return != null) monthlyMap[month].returns.push(p.daily_return);
      monthlyMap[month].pnl += p.daily_pnl ?? 0;
    }

    const months = Object.keys(monthlyMap).sort();
    return months.map((m) => {
      const data = monthlyMap[m];
      const totalReturn = data.returns.reduce((a, b) => (1 + a) * (1 + b) - 1, 0);
      const pnl = data.pnl;
      return { month: m, return: totalReturn, pnl, tradeCount: data.returns.length };
    });
  }, [performance]);

  if (isLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ListSkeleton rows={4} variant="card" />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} tintColor={colors.primary[500]} />
      }
    >
      {/* KPI 卡片 */}
      {kpis && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiRow}
        >
          {kpis.map((kpi) => (
            <StatCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              isLoading={false}
            />
          ))}
        </ScrollView>
      )}

      {/* 净值曲线 */}
      <EquityCurve data={performance ?? []} height={300} />

      {/* 持仓构成 */}
      <PositionComposition
        positions={positionsData?.positions ?? []}
      />

      {/* 交易活跃度 */}
      <TradeActivityChart data={tradeActivity ?? []} />

      {/* 月度收益热力图 */}
      {monthlyReturns && monthlyReturns.length > 0 && (
        <View style={styles.heatmapCard}>
          <Text style={styles.sectionTitle}>月度收益</Text>
          <View style={styles.heatmapGrid}>
            {monthlyReturns.map((m) => {
              const isPositive = m.return >= 0;
              const intensity = Math.min(Math.abs(m.return) * 3, 1);
              const bgColor = isPositive
                ? `rgba(220, 38, 38, ${0.15 + intensity * 0.6})`
                : `rgba(22, 163, 74, ${0.15 + intensity * 0.6})`;

              return (
                <View key={m.month} style={styles.heatmapItem}>
                  <View style={[styles.heatmapCell, { backgroundColor: bgColor }]}>
                    <Text style={[styles.heatmapValue, { color: isPositive ? colors.up : colors.down }]}>
                      {formatPercent(m.return, 1)}
                    </Text>
                  </View>
                  <Text style={styles.heatmapLabel}>{m.month.slice(5)}月</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 持仓明细 */}
      <Text style={styles.sectionTitle}>持仓明细</Text>
      <PositionsTable
        positions={positionsData?.positions ?? []}
        isLoading={posLoading}
      />

      {/* 空状态 */}
      {!sessionId && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={colors.gray[300]} />
          <Text style={styles.emptyText}>未找到会话</Text>
        </View>
      )}
    </ScrollView>
  );
}

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
  kpiRow: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.gray[800],
  },
  heatmapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    padding: spacing[4],
    ...shadow.md,
  },
  heatmapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    marginTop: spacing[3],
    justifyContent: "flex-start",
  },
  heatmapItem: {
    alignItems: "center",
    gap: 4,
    width: (SCREEN_WIDTH - spacing[4] * 2 - spacing[2] * 5) / 4,
  },
  heatmapCell: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  heatmapValue: {
    ...typography.label,
    fontWeight: "600",
  },
  heatmapLabel: {
    ...typography.label,
    color: colors.gray[500],
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[12],
    gap: spacing[2],
  },
  emptyText: {
    ...typography.body,
    color: colors.gray[400],
  },
});
