// ============================================================
// Portfolio 页面 — 组合详情
// 净值曲线 + 持仓构成 + 持仓列表
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSessions } from "../../src/hooks/useSessions";
import { usePerformance } from "../../src/hooks/usePerformance";
import { usePositions } from "../../src/hooks/usePositions";
import { StatCard } from "../../src/components/cards/StatCard";
import { EquityCurve } from "../../src/components/charts/EquityCurve";
import { PositionComposition } from "../../src/components/charts/PositionComposition";
import { PositionsTable } from "../../src/components/tables/PositionsTable";
import { ListSkeleton } from "../../src/components/layout/LoadingSkeleton";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { formatCurrency, formatPercent } from "../../src/utils/format";

export default function PortfolioScreen() {
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 默认选第一个 session
  const activeId = selectedId ?? sessions?.[0]?.session_id ?? null;
  const { data: performance, isLoading: perfLoading } = usePerformance(activeId);
  const { data: positionsData, isLoading: posLoading } = usePositions(activeId);

  // 计算绩效指标
  const kpis = useMemo(() => {
    if (!performance || performance.length === 0) return null;
    const last = performance[performance.length - 1];
    let maxDd = 0;
    let peak = 0;
    for (const p of performance) {
      if (p.portfolio_value > peak) peak = p.portfolio_value;
      const dd = (peak - p.portfolio_value) / peak;
      if (dd > maxDd) maxDd = dd;
    }
    return [
      { label: "最新净值", value: formatCurrency(last.portfolio_value, 0), change: null },
      { label: "累计收益", value: formatPercent(last.cumulative_return ?? 0), change: last.cumulative_return },
      { label: "最大回撤", value: formatPercent(-maxDd), change: null },
      { label: "持仓数", value: String(positionsData?.num_positions ?? 0), change: null },
    ];
  }, [performance, positionsData]);

  const isLoading = sessionsLoading || perfLoading || posLoading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} tintColor={colors.primary[500]} />
      }
    >
      {/* Session 选择器 */}
      {sessions && sessions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selector}
        >
          {sessions.map((s) => (
            <TouchableOpacity
              key={s.session_id}
              style={[
                styles.sessionChip,
                activeId === s.session_id && styles.sessionChipActive,
              ]}
              onPress={() => setSelectedId(s.session_id)}
            >
              <Text
                style={[
                  styles.sessionChipText,
                  activeId === s.session_id && styles.sessionChipTextActive,
                ]}
              >
                {s.session_name || s.session_id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* KPI 卡片行 */}
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
              isLoading={isLoading}
            />
          ))}
        </ScrollView>
      )}

      {/* 净值曲线 */}
      <EquityCurve
        data={performance ?? []}
        isLoading={perfLoading}
        height={300}
      />

      {/* 持仓构成 + 持仓列表 */}
      <PositionComposition
        positions={positionsData?.positions ?? []}
        isLoading={posLoading}
      />

      <Text style={styles.sectionTitle}>持仓明细</Text>
      <PositionsTable
        positions={positionsData?.positions ?? []}
        isLoading={posLoading}
      />

      {/* 空状态 */}
      {!isLoading && !activeId && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>请选择一个投资组合</Text>
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
  selector: {
    gap: spacing[2],
    paddingRight: spacing[4],
  },
  sessionChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  sessionChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  sessionChipText: {
    ...typography.caption,
    color: colors.gray[600],
  },
  sessionChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  kpiRow: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.gray[800],
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[12],
  },
  emptyText: {
    ...typography.body,
    color: colors.gray[400],
  },
});
