// ============================================================
// EquityCurve — 净值曲线 + 回撤 (面积图 + 柱状图)
// 使用 react-native-gifted-charts
// ============================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadow } from "../../theme/theme";
import type { PerformancePoint } from "../../lib/types";
import { formatDate } from "../../utils/format";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_PADDING = spacing[4] * 2;

interface EquityCurveProps {
  data: PerformancePoint[];
  period?: "1M" | "3M" | "6M" | "1Y" | "ALL";
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  height?: number;
}

const PERIOD_LABELS = [
  { key: "1M", label: "1月" },
  { key: "3M", label: "3月" },
  { key: "6M", label: "6月" },
  { key: "1Y", label: "1年" },
  { key: "ALL", label: "全部" },
] as const;

export function EquityCurve({
  data,
  period = "ALL",
  isLoading = false,
  isError = false,
  onRetry,
  height = 280,
}: EquityCurveProps) {
  const chartWidth = SCREEN_WIDTH - CHART_PADDING;

  // 转换为图表数据格式
  const { lineData, barData, yMax, yMin } = useMemo(() => {
    if (!data || data.length === 0) return { lineData: [], barData: [], yMax: 0, yMin: 0 };

    const values = data.map((d) => d.portfolio_value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = (max - min) * 0.1;

    const lineData = data.map((d, i) => ({
      value: d.portfolio_value,
      // PostgreSQL 返回 UTC ISO 时间；不能直接截取字符串，否则北京时间会少一天。
      label: i % Math.ceil(data.length / 6) === 0 ? formatDate(d.trade_date) : "",
      dataPointText: "",
    }));

    const barData = data.map((d, i) => ({
      value: (d.drawdown ?? 0) * 100,
      frontColor: colors.downLight,
      label: "",
      topLabelComponent: () => null,
    }));

    return {
      lineData,
      barData,
      yMax: max + padding,
      yMin: min - padding,
    };
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

  if (isError) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <Ionicons name="warning-outline" size={32} color={colors.gray[400]} />
          <Text style={styles.placeholderText}>数据加载失败</Text>
          {onRetry && (
            <Text style={styles.retryText} onPress={onRetry}>
              点击重试
            </Text>
          )}
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <Ionicons name="analytics-outline" size={40} color={colors.gray[300]} />
          <Text style={styles.placeholderText}>暂无净值数据</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 标题行 */}
      <View style={styles.header}>
        <Text style={styles.title}>净值曲线</Text>
        <View style={styles.periodRow}>
          {PERIOD_LABELS.map((p) => (
            <Text
              key={p.key}
              style={[styles.periodBtn, period === p.key && styles.periodActive]}
              onPress={() => {}}
            >
              {p.label}
            </Text>
          ))}
        </View>
      </View>

      {/* 净值面积图 */}
      <View style={{ marginTop: spacing[2] }}>
        <LineChart
          data={lineData}
          width={chartWidth - spacing[4]}
          height={height * 0.6}
          areaChart
          curved
          // 数据点很多时每个点的间距只有数像素。图表库会把标签容器也设成
          // 这个宽度，导致日期被截断成“0..”。仅展示采样标签并给其预留宽度。
          isAnimated={false}
          labelsExtraHeight={44}
          color={colors.primary[500]}
          startFillColor={colors.primary[200]}
          startOpacity={0.3}
          endFillColor={colors.primary[50]}
          endOpacity={0.05}
          thickness={2}
          maxValue={yMax}
          noOfSections={4}
          yAxisTextStyle={{ color: colors.gray[400], fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.gray[400], fontSize: 9 }}
          hideDataPoints
          hideRules
          initialSpacing={10}
          spacing={chartWidth / Math.max(data.length, 1)}
        />
      </View>

      {/* 回撤柱状图 */}
      <View style={{ marginTop: spacing[1] }}>
        <BarChart
          data={barData}
          width={chartWidth - spacing[4]}
          height={height * 0.25}
          isAnimated
          animationDuration={800}
          maxValue={Math.max(...barData.map((d) => d.value), 1)}
          noOfSections={2}
          yAxisTextStyle={{ color: colors.gray[400], fontSize: 9 }}
          xAxisLabelTextStyle={{ color: "transparent", fontSize: 1 }}
          hideRules
          initialSpacing={10}
          spacing={chartWidth / Math.max(data.length, 1)}
          frontColor={colors.downLight}
          barBorderRadius={1}
        />
      </View>

      {/* 图例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary[500] }]} />
          <Text style={styles.legendText}>净值</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.down }]} />
          <Text style={styles.legendText}>回撤</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...typography.h3,
  },
  periodRow: {
    flexDirection: "row",
    gap: 2,
    backgroundColor: colors.gray[100],
    borderRadius: radius.sm,
    padding: 2,
  },
  periodBtn: {
    ...typography.label,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radius.sm,
    color: colors.gray[500],
  },
  periodActive: {
    backgroundColor: colors.primary[500],
    color: "#FFFFFF",
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
  retryText: {
    ...typography.caption,
    color: colors.primary[500],
    fontWeight: "500",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[4],
    marginTop: spacing[2],
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    ...typography.label,
    color: colors.gray[500],
  },
});
