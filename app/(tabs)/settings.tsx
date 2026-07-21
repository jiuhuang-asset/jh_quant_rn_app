// ============================================================
// Settings 页面 — 设置
// DB 连接状态 / 主题 / 涨跌色 / 关于
// ============================================================

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, darkColors, spacing, radius, typography, shadow } from "../../src/theme/theme";
import { BRAND_NAME, BRAND_TAGLINE_ZH, APP_VERSION } from "../../src/utils/constants";

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

function SettingRow({ icon, label, value, onPress, showArrow = true, danger = false }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress}>
      <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.primary[500]} />
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {showArrow && <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 数据 */}
      <Text style={styles.sectionLabel}>数据</Text>
      <View style={styles.card}>
        <SettingRow
          icon="cloud-outline"
          label="数据库连接"
          value="检测中..."
        />
        <SettingRow
          icon="refresh-outline"
          label="手动刷新数据"
          onPress={() => {}}
        />
        <SettingRow
          icon="time-outline"
          label="自动刷新间隔"
          value="60 秒"
        />
      </View>

      {/* 外观 */}
      <Text style={styles.sectionLabel}>外观</Text>
      <View style={styles.card}>
        <SettingRow
          icon="moon-outline"
          label="深色模式"
          value={isDark ? "深色" : "浅色"}
        />
        <SettingRow
          icon="trending-up-outline"
          label="涨跌色方案"
          value="红涨绿跌 (A股)"
        />
      </View>

      {/* 关于 */}
      <Text style={styles.sectionLabel}>关于</Text>
      <View style={styles.card}>
        <View style={styles.aboutHeader}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="analytics" size={32} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.appName}>{BRAND_NAME}</Text>
            <Text style={styles.appTagline}>{BRAND_TAGLINE_ZH}</Text>
          </View>
        </View>
        <SettingRow
          icon="information-circle-outline"
          label="版本"
          value={`v${APP_VERSION}`}
          showArrow={false}
        />
        <SettingRow
          icon="code-slash-outline"
          label="技术栈"
          value="Expo + React Native + Neon PG"
          showArrow={false}
        />
      </View>

      <Text style={styles.footer}>
        © 2026 JH_QUANT. All rights reserved.
      </Text>
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
    gap: spacing[2],
    paddingBottom: spacing[12],
  },
  sectionLabel: {
    ...typography.label,
    color: colors.gray[500],
    paddingHorizontal: spacing[1],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray[100],
  },
  rowLabel: {
    ...typography.body,
    color: colors.gray[700],
    flex: 1,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  rowValue: {
    ...typography.caption,
    color: colors.gray[400],
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[4],
    gap: spacing[3],
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray[100],
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    ...typography.h3,
    color: colors.gray[800],
  },
  appTagline: {
    ...typography.caption,
    color: colors.gray[500],
  },
  footer: {
    ...typography.label,
    color: colors.gray[400],
    textAlign: "center",
    paddingTop: spacing[8],
  },
});
