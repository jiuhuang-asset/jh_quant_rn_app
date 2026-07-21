// ============================================================
// Settings 页面 — 设置
// DB 连接管理 / 主题 / 涨跌色 / 关于
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, darkColors, spacing, radius, typography } from "../../src/theme/theme";
import { BRAND_NAME, BRAND_TAGLINE_ZH, APP_VERSION } from "../../src/utils/constants";
import {
  getConnectionString,
  saveConnectionString,
  deleteConnectionString,
} from "../../src/lib/dbConfig";

// ——— SettingRow 组件 ———

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
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {showArrow && <Ionicons name="chevron-forward" size={18} color={colors.gray[300]} />}
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// SettingsScreen
// ============================================================

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // DB 配置状态
  const [dbModalVisible, setDbModalVisible] = useState(false);
  const [dbConnectionString, setDbConnectionString] = useState("");
  const [dbStatus, setDbStatus] = useState<"unknown" | "connected" | "disconnected">("unknown");
  const [dbTesting, setDbTesting] = useState(false);
  const [dbError, setDbError] = useState("");
  const [dbSuccess, setDbSuccess] = useState("");

  // ——— 加载已保存的连接串 ———
  useEffect(() => {
    (async () => {
      const saved = await getConnectionString();
      if (saved) {
        setDbConnectionString(saved);
        // 后台检查连通性
        checkDbStatus(saved);
      }
    })();
  }, []);

  // ——— 检查 DB 连通性 ———
  const checkDbStatus = useCallback(async (connStr: string) => {
    try {
      const res = await fetch("/api/db-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionString: connStr }),
      });
      const data = await res.json();
      setDbStatus(data.success ? "connected" : "disconnected");
    } catch {
      setDbStatus("disconnected");
    }
  }, []);

  // ——— 打开 DB 配置弹窗时加载当前值 ———
  const handleOpenDbModal = useCallback(async () => {
    setDbError("");
    setDbSuccess("");
    const saved = await getConnectionString();
    if (saved) {
      setDbConnectionString(saved);
    }
    setDbModalVisible(true);
  }, []);

  // ——— 测试连接 ———
  const handleTestDb = useCallback(async () => {
    if (!dbConnectionString.trim()) {
      setDbError("请输入数据库连接串");
      return;
    }
    setDbTesting(true);
    setDbError("");
    setDbSuccess("");
    try {
      const res = await fetch("/api/db-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionString: dbConnectionString.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setDbSuccess(`连接成功! PostgreSQL ${data.pgVersion || ""}`);
        setDbStatus("connected");
      } else {
        setDbError(data.error || "连接失败");
      }
    } catch (err) {
      setDbError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setDbTesting(false);
    }
  }, [dbConnectionString]);

  // ——— 保存连接串 ———
  const handleSaveDb = useCallback(async () => {
    await saveConnectionString(dbConnectionString.trim());
    setDbModalVisible(false);
    // 刷新状态
    checkDbStatus(dbConnectionString.trim());
  }, [dbConnectionString, checkDbStatus]);

  // ——— 重置连接串 ———
  const handleResetDb = useCallback(() => {
    Alert.alert(
      "重置数据库连接",
      "确定要清除已保存的数据库连接配置吗? 下次启动 App 时需要重新配置.",
      [
        { text: "取消", style: "cancel" },
        {
          text: "重置",
          style: "destructive",
          onPress: async () => {
            await deleteConnectionString();
            setDbConnectionString("");
            setDbStatus("disconnected");
            setDbModalVisible(false);
          },
        },
      ]
    );
  }, []);

  // ——— DB 状态文字 ———
  const dbStatusText =
    dbStatus === "connected"
      ? "已连接"
      : dbStatus === "disconnected"
        ? "未连接"
        : "检测中...";

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* 数据 */}
        <Text style={styles.sectionLabel}>数据</Text>
        <View style={styles.card}>
          <SettingRow
            icon="cloud-outline"
            label="数据库连接"
            value={dbStatusText}
            onPress={handleOpenDbModal}
          />
          <SettingRow
            icon="refresh-outline"
            label="手动刷新数据"
            onPress={() => {}}
          />
          <SettingRow
            icon="time-outline"
            label="自动刷新间隔"
            value="5 分钟"
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

      {/* ============================================================ */}
      {/*  DB 配置弹窗 */}
      {/* ============================================================ */}
      <Modal
        visible={dbModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDbModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setDbModalVisible(false)}>
              <Ionicons name="close" size={28} color={colors.gray[600]} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>数据库连接配置</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* 说明 */}
            <View style={styles.modalInfo}>
              <Ionicons name="information-circle-outline" size={20} color={colors.info} />
              <Text style={styles.modalInfoText}>
                修改连接串后需要测试连接成功才能生效.{"\n"}
                连接串安全保存在您的设备上.
              </Text>
            </View>

            {/* 连接串输入 */}
            <Text style={styles.modalLabel}>PostgreSQL 连接串</Text>
            <TextInput
              style={styles.modalInput}
              value={dbConnectionString}
              onChangeText={(text) => {
                setDbConnectionString(text);
                setDbError("");
                setDbSuccess("");
              }}
              placeholder="postgresql://user:password@host/database"
              placeholderTextColor={colors.gray[400]}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* 错误提示 */}
            {dbError ? (
              <View style={styles.modalFeedback}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.modalErrorText}>{dbError}</Text>
              </View>
            ) : null}

            {/* 成功提示 */}
            {dbSuccess ? (
              <View style={styles.modalFeedback}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.modalSuccessText}>{dbSuccess}</Text>
              </View>
            ) : null}

            {/* 按钮 */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalTestBtn, dbTesting && { opacity: 0.6 }]}
                onPress={handleTestDb}
                disabled={dbTesting || !dbConnectionString.trim()}
                activeOpacity={0.75}
              >
                {dbTesting ? (
                  <ActivityIndicator size="small" color={colors.primary[500]} />
                ) : (
                  <Ionicons name="flash-outline" size={18} color={colors.primary[500]} />
                )}
                <Text style={styles.modalTestBtnText}>
                  {dbTesting ? "测试中..." : "测试连接"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSaveBtn,
                  !dbSuccess && { opacity: 0.4 },
                ]}
                onPress={handleSaveDb}
                disabled={!dbSuccess}
                activeOpacity={0.75}
              >
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                <Text style={styles.modalSaveBtnText}>保存并使用</Text>
              </TouchableOpacity>
            </View>

            {/* 重置 */}
            <TouchableOpacity
              style={styles.modalResetBtn}
              onPress={handleResetDb}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={styles.modalResetText}>清除配置</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

// ——— Styles ———

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

  // ——— Modal ———
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingTop: Platform.OS === "ios" ? spacing[4] : spacing[2],
    paddingBottom: spacing[3],
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    ...typography.h3,
    color: colors.gray[800],
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: spacing[4],
    gap: spacing[3],
  },
  modalInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[2],
    backgroundColor: "#E0F2FE",
    padding: spacing[3],
    borderRadius: radius.md,
  },
  modalInfoText: {
    ...typography.caption,
    color: "#0369A1",
    flex: 1,
    lineHeight: 20,
  },
  modalLabel: {
    ...typography.label,
    color: colors.gray[600],
    textTransform: "uppercase",
    marginTop: spacing[2],
  },
  modalInput: {
    ...typography.caption,
    color: colors.gray[800],
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: radius.md,
    padding: spacing[3],
    fontFamily: "monospace",
    minHeight: 80,
  },
  modalFeedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  modalErrorText: {
    ...typography.label,
    color: colors.danger,
    flex: 1,
  },
  modalSuccessText: {
    ...typography.label,
    color: colors.success,
    flex: 1,
  },
  modalButtons: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
  modalTestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary[500],
  },
  modalTestBtnText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.primary[500],
  },
  modalSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.primary[500],
  },
  modalSaveBtnText: {
    ...typography.body,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalResetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    paddingVertical: spacing[2],
    marginTop: spacing[2],
  },
  modalResetText: {
    ...typography.caption,
    color: colors.danger,
  },
});
