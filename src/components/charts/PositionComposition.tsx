// ============================================================
// PositionComposition — 持仓构成环形图
// ============================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadow, chartColors } from "../../theme/theme";
import { formatCurrency } from "../../utils/format";
import type { PositionDetail } from "../../lib/types";

interface PositionCompositionProps {
  positions: PositionDetail[];
  isLoading?: boolean;
  height?: number;
}

export function PositionComposition({
  positions,
  isLoading = false,
  height = 240,
}: PositionCompositionProps) {
  const { pieData, totalValue } = useMemo(() => {
    if (!positions || positions.length === 0) return { pieData: [], totalValue: 0 };

    const total = positions.reduce((sum, p) => sum + p.market_value, 0);

    // 最多展示 5 个，其余合并为 "其他"
    const sorted = [...positions].sort((a, b) => b.market_value - a.market_value);
    const top5 = sorted.slice(0, 5);

    const pieData = top5.map((p, i) => ({
      value: p.market_value,
      color: chartColors[i % chartColors.length],
      text: p.symbol,
      focused: i === 0,
    }));

    const otherValue = sorted.slice(5).reduce((s, p) => s + p.market_value, 0);
    if (otherValue > 0) {
      pieData.push({
        value: otherValue,
        color: chartColors[5],
        text: "其他",
      });
    }

    return { pieData, totalValue: total };
  }, [positions]);

  if (isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <Ionicons name="pie-chart-outline" size={40} color={colors.gray[300]} />
          <Text style={styles.placeholderText}>暂无持仓</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>持仓构成</Text>
      <View style={styles.chartArea}>
        <PieChart
          data={pieData}
          donut
          radius={80}
          innerRadius={50}
          centerLabelComponent={() => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 11, color: colors.gray[500] }}>总市值</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.gray[800] }}>
                {formatCurrency(totalValue, 0)}
              </Text>
            </View>
          )}
        />
        {/* 图例 */}
        <View style={styles.legendWrap}>
          {pieData.map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText} numberOfLines={1}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    padding: spacing[4],
    ...shadow.md,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing[3],
  },
  chartArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
  },
  placeholderText: {
    ...typography.body,
    color: colors.gray[400],
  },
  legendWrap: {
    flex: 1,
    gap: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    ...typography.label,
    color: colors.gray[600],
  },
});
