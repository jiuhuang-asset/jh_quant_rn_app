// ============================================================
// TradeActivity — 每日交易活跃度柱状图
// ============================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadow } from "../../theme/theme";
import type { TradeActivityPoint } from "../../lib/types";

interface TradeActivityProps {
  data: TradeActivityPoint[];
  isLoading?: boolean;
  height?: number;
}

export function TradeActivityChart({ data, isLoading = false, height = 220 }: TradeActivityProps) {
  const barData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d, i) => ({
      value: d.trade_count,
      label: i % Math.ceil(data.length / 6) === 0 ? d.trade_date.slice(5, 10) : "",
      frontColor: colors.primary[400],
      topLabelComponent: () => null,
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
          <Text style={styles.placeholderText}>暂无交易数据</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>交易活跃度</Text>
      <BarChart
        data={barData}
        barWidth={Math.max(4, 200 / data.length)}
        spacing={2}
        noOfSections={4}
        yAxisTextStyle={{ color: colors.gray[400], fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.gray[400], fontSize: 9 }}
        hideRules
        isAnimated
        animationDuration={800}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={colors.gray[200]}
        initialSpacing={10}
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
