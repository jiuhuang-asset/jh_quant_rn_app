// ============================================================
// SessionCard — 投资组合选择卡片
// ============================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadow } from "../../theme/theme";
import { upDownColor } from "../../utils/colors";
import { formatCurrency, formatPercent } from "../../utils/format";
import type { SessionInfo } from "../../lib/types";
import { SessionCardSkeleton } from "../layout/LoadingSkeleton";

interface SessionCardProps {
  session: SessionInfo;
  isSelected?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
}

export function SessionCard({ session, isSelected = false, isLoading = false, onPress }: SessionCardProps) {
  if (isLoading) return <SessionCardSkeleton />;

  const isLive = session.mode === "live";
  const returnColor = upDownColor(session.total_return ?? 0);

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 头部: 名称 + 模式标签 */}
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {session.session_name || session.session_id}
        </Text>
        <View style={[styles.badge, isLive ? styles.badgeLive : styles.badgePaper]}>
          <Text style={styles.badgeText}>{isLive ? "LIVE" : "PAPER"}</Text>
        </View>
      </View>

      {/* 核心指标 */}
      <View style={styles.metrics}>
        <View style={styles.mainMetric}>
          <Text style={[styles.mainValue, { color: returnColor }]}>
            {session.total_return != null ? formatPercent(session.total_return) : "--"}
          </Text>
          <Text style={styles.mainLabel}>累计收益</Text>
        </View>

        <View style={styles.subMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {session.current_value != null ? formatCurrency(session.current_value) : "--"}
            </Text>
            <Text style={styles.metricLabel}>最新净值</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{session.total_trades ?? "--"}</Text>
            <Text style={styles.metricLabel}>交易笔数</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {session.win_rate != null ? formatPercent(session.win_rate, 1) : "--"}
            </Text>
            <Text style={styles.metricLabel}>胜率</Text>
          </View>
        </View>
      </View>

      {/* 底部迷你信息 */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={12} color={colors.gray[400]} />
          <Text style={styles.footerText}>
            {session.latest_date ?? "暂无数据"}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="layers-outline" size={12} color={colors.gray[400]} />
          <Text style={styles.footerText}>{session.position_count ?? 0} 持仓</Text>
        </View>
        {session.strategy_names?.length > 0 && (
          <View style={styles.footerItem}>
            <Ionicons name="flash-outline" size={12} color={colors.gray[400]} />
            <Text style={styles.footerText} numberOfLines={1}>
              {session.strategy_names.join(", ")}
            </Text>
          </View>
        )}
      </View>

      {/* 选中指示器 */}
      {isSelected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    padding: spacing[4],
    gap: spacing[3],
    ...shadow.sm,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing[2],
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeLive: { backgroundColor: colors.danger },
  badgePaper: { backgroundColor: colors.primary[200] },
  badgeText: {
    ...typography.label,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  metrics: {
    gap: spacing[2],
  },
  mainMetric: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing[2],
  },
  mainValue: {
    ...typography.kpi,
  },
  mainLabel: {
    ...typography.caption,
    color: colors.gray[500],
  },
  subMetrics: {
    flexDirection: "row",
    gap: spacing[4],
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  metricValue: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.gray[700],
  },
  metricLabel: {
    ...typography.label,
    color: colors.gray[400],
  },
  footer: {
    flexDirection: "row",
    gap: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    flexWrap: "wrap",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  footerText: {
    ...typography.label,
    color: colors.gray[500],
  },
  checkmark: {
    position: "absolute",
    top: spacing[2],
    right: spacing[2],
  },
});
