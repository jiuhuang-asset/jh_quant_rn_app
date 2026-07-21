// ============================================================
// PositionsTable — 持仓明细表
// ============================================================

import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius } from "../../theme/theme";
import { upDownColor } from "../../utils/colors";
import { formatCurrency, formatPercent } from "../../utils/format";
import type { PositionDetail } from "../../lib/types";
import { TableRowSkeleton } from "../layout/LoadingSkeleton";

interface PositionsTableProps {
  positions: PositionDetail[];
  isLoading?: boolean;
}

export function PositionsTable({ positions, isLoading = false }: PositionsTableProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        {Array.from({ length: 4 }).map((_, i) => (
          <TableRowSkeleton key={i} cols={6} />
        ))}
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      {["股票", "持仓", "现价", "市值", "盈亏%", "权重"].map((col, i) => (
        <Text key={col} style={[styles.headerCell, i >= 2 && styles.cellRight]}>
          {col}
        </Text>
      ))}
    </View>
  );

  const renderRow = ({ item }: { item: PositionDetail }) => {
    const pnlColor = upDownColor(item.pnl ?? 0);
    const weight = item.weight ?? 0;

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.cellBold]}>{item.symbol}</Text>
        <Text style={styles.cell}>{item.quantity}股</Text>
        <Text style={[styles.cell, styles.cellRight]}>{formatCurrency(item.current_price)}</Text>
        <Text style={[styles.cell, styles.cellRight]}>{formatCurrency(item.market_value, 0)}</Text>
        <Text style={[styles.cell, styles.cellRight, { color: pnlColor, fontWeight: "600" }]}>
          {item.pnl_pct != null ? formatPercent(item.pnl_pct) : "--"}
        </Text>
        <Text style={[styles.cell, styles.cellRight]}>{formatPercent(weight, 1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={positions}
        renderItem={renderRow}
        keyExtractor={(item) => item.symbol}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {positions.length === 0 && !isLoading && (
        <View style={styles.empty}>
          <Ionicons name="briefcase-outline" size={40} color={colors.gray[300]} />
          <Text style={styles.emptyText}>暂无持仓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerCell: {
    flex: 1,
    ...typography.label,
    color: colors.gray[500],
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: "center",
  },
  cell: {
    flex: 1,
    ...typography.tabular,
    color: colors.gray[700],
  },
  cellBold: {
    fontWeight: "600",
    color: colors.gray[800],
  },
  cellRight: {
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[50],
    marginHorizontal: spacing[4],
  },
  empty: {
    alignItems: "center",
    paddingVertical: spacing[10],
    gap: spacing[2],
  },
  emptyText: {
    ...typography.body,
    color: colors.gray[400],
  },
});
