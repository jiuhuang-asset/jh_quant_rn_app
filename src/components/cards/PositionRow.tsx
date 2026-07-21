// ============================================================
// PositionRow — 持仓行 (对应 DESIGN.md section 7.4)
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography, shadow } from "../../theme/theme";
import { upDownColor } from "../../utils/colors";
import { formatCurrency, formatPercent } from "../../utils/format";
import type { PositionDetail } from "../../lib/types";

interface PositionRowProps {
  position: PositionDetail;
}

export function PositionRow({ position }: PositionRowProps) {
  const pnlColor = upDownColor(position.pnl ?? 0);
  const weight = position.weight ?? 0;
  const weightPct = formatPercent(weight, 1);

  return (
    <View style={styles.card}>
      {/* 第一行: symbol + 盈亏趋势 */}
      <View style={styles.row1}>
        <Text style={styles.symbol}>{position.symbol}</Text>
        <Text style={[styles.pnlValue, { color: pnlColor }]}>
          {position.pnl != null ? `${position.pnl >= 0 ? "+" : ""}${formatCurrency(position.pnl)}` : "--"}
        </Text>
      </View>

      {/* 第二行: 持仓详情 */}
      <View style={styles.row2}>
        <Text style={styles.detail}>
          持仓 <Text style={styles.detailValue}>{position.quantity}股</Text>
        </Text>
        <Text style={styles.detail}>
          成本 <Text style={styles.detailValue}>{formatCurrency(position.avg_cost)}</Text>
        </Text>
        <Text style={styles.detail}>
          现价 <Text style={styles.detailValue}>{formatCurrency(position.current_price)}</Text>
        </Text>
      </View>

      {/* 第三行: 市值 + 盈亏% */}
      <View style={styles.row3}>
        <Text style={styles.marketValue}>
          市值 {formatCurrency(position.market_value)}
        </Text>
        {position.pnl_pct != null && (
          <Text style={[styles.pnlPct, { color: pnlColor }]}>
            {formatPercent(position.pnl_pct)}
          </Text>
        )}
      </View>

      {/* 权重进度条 */}
      <View style={styles.weightBar}>
        <View style={[styles.weightFill, { width: `${Math.min(weight * 100, 100)}%` }]} />
        <Text style={styles.weightText}>权重 {weightPct}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    padding: spacing[4],
    gap: spacing[2],
    ...shadow.sm,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  symbol: {
    ...typography.h3,
    color: colors.gray[800],
  },
  pnlValue: {
    ...typography.body,
    fontWeight: "600",
  },
  row2: {
    flexDirection: "row",
    gap: spacing[3],
    flexWrap: "wrap",
  },
  detail: {
    ...typography.label,
    color: colors.gray[500],
  },
  detailValue: {
    color: colors.gray[700],
    fontWeight: "500",
  },
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marketValue: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.gray[700],
  },
  pnlPct: {
    ...typography.body,
    fontWeight: "600",
  },
  weightBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    height: 14,
    backgroundColor: colors.gray[100],
    borderRadius: radius.full,
    overflow: "hidden",
    position: "relative",
  },
  weightFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary[400],
    borderRadius: radius.full,
  },
  weightText: {
    ...typography.label,
    color: colors.gray[600],
    marginLeft: spacing[2],
    zIndex: 1,
  },
});
