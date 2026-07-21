// ============================================================
// Trades 页面 — 交易记录
// 筛选 + 交易明细表 + 分页
// ============================================================

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSessions } from "../../src/hooks/useSessions";
import { useTrades } from "../../src/hooks/useTrades";
import { TradesTable } from "../../src/components/tables/TradesTable";
import { colors, spacing, radius, typography } from "../../src/theme/theme";

export default function TradesScreen() {
  const { data: sessions } = useSessions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ symbol: "", tradeType: "" });

  const activeId = selectedId ?? sessions?.[0]?.session_id ?? null;
  const {
    data: tradesData,
    isLoading,
    refetch,
  } = useTrades(activeId, page, 20, {
    symbol: filters.symbol || undefined,
    tradeType: filters.tradeType || undefined,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary[500]} />
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
              onPress={() => {
                setSelectedId(s.session_id);
                setPage(1);
              }}
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

      {/* 筛选栏 */}
      <View style={styles.filterBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="股票代码..."
            placeholderTextColor={colors.gray[400]}
            value={filters.symbol}
            onChangeText={(v) => {
              setFilters((f) => ({ ...f, symbol: v }));
              setPage(1);
            }}
          />
        </View>

        <View style={styles.filterToggles}>
          {[
            { key: "", label: "全部" },
            { key: "BUY", label: "买入" },
            { key: "SELL", label: "卖出" },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                filters.tradeType === f.key && styles.filterBtnActive,
              ]}
              onPress={() => {
                setFilters((prev) => ({ ...prev, tradeType: f.key }));
                setPage(1);
              }}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  filters.tradeType === f.key && styles.filterBtnTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 交易表格 */}
      <TradesTable
        trades={tradesData?.trades ?? []}
        isLoading={isLoading}
        total={tradesData?.total ?? 0}
        page={page}
        pageSize={20}
        onPageChange={setPage}
      />
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
  filterBar: {
    gap: spacing[3],
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.gray[700],
    paddingVertical: 2,
  },
  filterToggles: {
    flexDirection: "row",
    gap: spacing[2],
  },
  filterBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filterBtnActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterBtnText: {
    ...typography.caption,
    color: colors.gray[600],
  },
  filterBtnTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
