// ============================================================
// TradesTable — 交易明细表
// ============================================================

import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius } from "../../theme/theme";
import { upDownColor } from "../../utils/colors";
import { formatTradeAmount, formatDateTime } from "../../utils/format";
import type { TradeRecord } from "../../lib/types";
import { TableRowSkeleton } from "../layout/LoadingSkeleton";

interface TradesTableProps {
  trades: TradeRecord[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function TradesTable({
  trades,
  isLoading = false,
  total = 0,
  page = 1,
  pageSize = 20,
  onPageChange,
}: TradesTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (isLoading) {
    return (
      <View style={styles.container}>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRowSkeleton key={i} cols={6} />
        ))}
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      {["日期", "股票", "方向", "价格", "数量", "金额"].map((col, i) => (
        <Text key={col} style={[styles.headerCell, i >= 3 && styles.cellRight]}>
          {col}
        </Text>
      ))}
    </View>
  );

  const renderRow = ({ item }: { item: TradeRecord }) => {
    const typeColor = upDownColor(item.trade_type === "BUY" ? 1 : -1);
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{formatDateTime(item.trade_date)}</Text>
        <Text style={[styles.cell, styles.cellBold]}>{item.symbol}</Text>
        <Text style={[styles.cell, { color: typeColor, fontWeight: "600" }]}>
          {item.trade_type === "BUY" ? "买入" : "卖出"}
        </Text>
        <Text style={[styles.cell, styles.cellRight]}>{item.price.toFixed(2)}</Text>
        <Text style={[styles.cell, styles.cellRight]}>{item.quantity}</Text>
        <Text style={[styles.cell, styles.cellRight]}>{formatTradeAmount(item.amount, 2)}</Text>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
        onPress={() => onPageChange?.(page - 1)}
        disabled={page <= 1}
      >
        <Ionicons name="chevron-back" size={16} color={page <= 1 ? colors.gray[300] : colors.primary[500]} />
      </TouchableOpacity>
      <Text style={styles.pageText}>
        {page} / {totalPages}
      </Text>
      <TouchableOpacity
        style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
        onPress={() => onPageChange?.(page + 1)}
        disabled={page >= totalPages}
      >
        <Ionicons name="chevron-forward" size={16} color={page >= totalPages ? colors.gray[300] : colors.primary[500]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={trades}
        renderItem={renderRow}
        keyExtractor={(item) => item.trade_id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {trades.length === 0 && !isLoading && (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={40} color={colors.gray[300]} />
          <Text style={styles.emptyText}>暂无交易记录</Text>
        </View>
      )}
      {renderFooter()}
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    gap: spacing[4],
  },
  pageBtn: {
    padding: spacing[1],
  },
  pageBtnDisabled: {
    opacity: 0.3,
  },
  pageText: {
    ...typography.caption,
    color: colors.gray[600],
  },
});
