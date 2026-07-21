// ============================================================
// StatCard — 指标卡片 (对应 DESIGN.md section 7.1)
// ============================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadow } from "../../theme/theme";
import { upDownColor } from "../../utils/colors";
import { StatCardSkeleton } from "../layout/LoadingSkeleton";

interface StatCardProps {
  label: string;
  value: string;
  change?: number | null;
  icon?: keyof typeof Ionicons.glyphMap;
  isLoading?: boolean;
  isError?: boolean;
  onPress?: () => void;
}

export function StatCard({
  label,
  value,
  change,
  icon = "trending-up",
  isLoading = false,
  isError = false,
  onPress,
}: StatCardProps) {
  if (isLoading) return <StatCardSkeleton />;

  const changeColor = upDownColor(change ?? 0);
  const changeSymbol = change != null && change > 0 ? "+" : "";

  const content = (
    <View style={styles.card}>
      {/* label row */}
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={16} color={colors.gray[400]} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>

      {/* value */}
      {isError ? (
        <Text style={[styles.value, { color: colors.gray[400], fontSize: 16 }]}>加载失败</Text>
      ) : (
        <Text style={[styles.value, { color: changeColor }]} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      )}

      {/* change indicator */}
      {change != null && (
        <View style={styles.changeRow}>
          <Ionicons
            name={change >= 0 ? "caret-up" : "caret-down"}
            size={12}
            color={changeColor}
          />
          <Text style={[styles.change, { color: changeColor }]}>
            {changeSymbol}{(change * 100).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    minWidth: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    padding: spacing[4],
    ...shadow.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    ...typography.caption,
    color: colors.gray[500],
  },
  value: {
    ...typography.kpi,
    marginTop: 6,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  change: {
    ...typography.label,
  },
});
