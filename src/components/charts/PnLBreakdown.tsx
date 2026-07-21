// ============================================================
// PnLBreakdown — 盈亏来源水平柱状图
// ============================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadow } from "../../theme/theme";
import { upDownColor } from "../../utils/colors";
import { formatCurrency } from "../../utils/format";
import type { PnlSourceItem } from "../../lib/types";

interface PnLBreakdownProps {
  data: PnlSourceItem[];
  isLoading?: boolean;
  height?: number;
}

export function PnLBreakdown({ data, isLoading = false, height = 250 }: PnLBreakdownProps) {
  const barData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a, b) => b.realized_pnl - a.realized_pnl);
    return sorted.map((item) => ({
      value: item.realized_pnl,
      label: item.symbol,
      frontColor: upDownColor(item.realized_pnl),
      topLabelComponent: () => (
        <Text style={{ fontSize: 10, color: colors.gray[600], marginBottom: 2 }}>
          {formatCurrency(item.realized_pnl, 0)}
        </Text>
      ),
    }));
  }, [data]);

  if (isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <Ionicons name="bar-chart-outline" size={40} color={colors.gray[300]} />
          <Text style={styles.placeholderText}>暂无盈亏数据</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>盈亏来源</Text>
      <BarChart
        data={barData}
        horizontal
        barWidth={20}
        spacing={16}
        noOfSections={4}
        yAxisTextStyle={{ color: colors.gray[400], fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.gray[600], fontSize: 10 }}
        hideRules
        isAnimated
        animationDuration={800}
        xAxisThickness={0}
        yAxisThickness={0}
      />
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
});
