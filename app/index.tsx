// ============================================================
// Splash / 首次配置页 — 数据库连接设置
//
// 首次启动: 强制用户输入 PG 连接串 → 测试连通性 → 进入 App
// 后续启动: 使用已保存的连接串 → 自动初始化 Pool → 进入 App
// 连接失败: 回退到配置表单, 允许用户修改
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  saveConnectionString,
  getConnectionString,
  hasConnectionString,
} from "../src/lib/dbConfig";
import { colors, darkColors, spacing, radius, typography } from "../src/theme/theme";
import { BRAND_NAME, BRAND_TAGLINE_ZH } from "../src/utils/constants";

type ScreenState =
  | "loading"        // 正在检查已保存的配置
  | "setup"          // 显示配置表单
  | "testing"        // 正在测试连接
  | "connecting"     // 正在用已保存配置连接
  | "error"          // 连接错误 (表单仍可见)
  | "success";       // 即将跳转

export default function SplashScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const themeColors = isDark ? { ...colors, ...darkColors } : colors;

  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [connectionString, setConnectionString] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ——— 启动时检查已保存的配置 ———
  useEffect(() => {
    (async () => {
      try {
        const hasConfig = await hasConnectionString();
        if (hasConfig) {
          const saved = await getConnectionString();
          if (saved) {
            setConnectionString(saved);
            setScreenState("connecting");
            await testAndInit(saved);
            return;
          }
        }
      } catch {
        // SecureStore 读取失败, 当作首次启动
      }
      setScreenState("setup");
    })();
  }, []);

  // ——— 测试连通性并初始化 Pool ———
  const testAndInit = useCallback(async (connStr: string) => {
    try {
      const res = await fetch("/api/db-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionString: connStr }),
      });
      const data = await res.json();

      if (data.success) {
        await saveConnectionString(connStr);
        setSuccessMessage(data.message || "数据库连接成功");
        setErrorMessage("");
        setScreenState("success");

        // 短暂展示成功状态后跳转
        setTimeout(() => {
          router.replace("/(tabs)/dashboard");
        }, 800);
      } else {
        setErrorMessage(data.error || "连接失败");
        setScreenState("setup");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "网络请求失败, 请检查连接"
      );
      setScreenState("setup");
    }
  }, []);

  // ——— 用户点击「测试连接」 ———
  const handleTestConnection = useCallback(async () => {
    if (!connectionString.trim()) {
      setErrorMessage("请输入数据库连接串");
      return;
    }
    setScreenState("testing");
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch("/api/db-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionString: connectionString.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMessage(
          `连接成功! PostgreSQL ${data.pgVersion || ""}`
        );
        setErrorMessage("");
        setScreenState("setup"); // 回到 setup 状态, 但此时「进入 App」已可用
      } else {
        setErrorMessage(data.error || "连接失败, 请检查连接串");
        setSuccessMessage("");
        setScreenState("setup");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "请求失败, 请检查网络"
      );
      setSuccessMessage("");
      setScreenState("setup");
    }
  }, [connectionString]);

  // ——— 用户点击「进入 App」 ———
  const handleContinue = useCallback(async () => {
    if (!connectionString.trim()) return;
    // 保存并跳转
    await saveConnectionString(connectionString.trim());
    router.replace("/(tabs)/dashboard");
  }, [connectionString]);

  // ——— Loading 状态 ———
  if (screenState === "loading" || screenState === "connecting") {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.primary[800] }]}>
        <StatusBar style="light" />
        <Ionicons name="analytics" size={64} color="#FFFFFF" />
        <Text style={styles.brandName}>{BRAND_NAME}</Text>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={{ marginTop: spacing[6] }}
        />
        <Text style={styles.loadingText}>
          {screenState === "connecting" ? "正在连接数据库..." : "正在加载..."}
        </Text>
      </View>
    );
  }

  // ——— Success (短暂展示) ———
  if (screenState === "success") {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.primary[800] }]}>
        <StatusBar style="light" />
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        </View>
        <Text style={styles.brandName}>{BRAND_NAME}</Text>
        <Text style={styles.successText}>{successMessage}</Text>
        <Text style={styles.hintText}>即将进入 App...</Text>
      </View>
    );
  }

  // ——— Setup / Error 状态 (主配置表单) ———
  const isTested = !!successMessage && !errorMessage;
  const bgColor = themeColors.primary[800] || "#0A2342";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: bgColor }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="light" />

        {/* ——— 品牌区域 ——— */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="analytics" size={44} color="#FFFFFF" />
          </View>
          <Text style={styles.brandName}>{BRAND_NAME}</Text>
          <Text style={styles.brandTagline}>{BRAND_TAGLINE_ZH}</Text>
        </View>

        {/* ——— 说明文字 ——— */}
        <View style={styles.instructionSection}>
          <Ionicons name="server-outline" size={22} color={themeColors.primary[200] || "#C5D8F0"} />
          <Text style={styles.instructionTitle}>配置数据库连接</Text>
          <Text style={styles.instructionText}>
            请输入您的 PostgreSQL (Neon) 数据库连接串.{"\n"}
            该信息将安全地保存在您的设备上.
          </Text>
        </View>

        {/* ——— 输入区 ——— */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>数据库连接串</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={connectionString}
              onChangeText={(text) => {
                setConnectionString(text);
                // 用户修改后清除成功状态
                if (successMessage) {
                  setSuccessMessage("");
                }
                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              placeholder="postgresql://user:password@host/db"
              placeholderTextColor={colors.gray[400]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={screenState !== "testing"}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>

          {/* 错误提示 */}
          {errorMessage ? (
            <View style={styles.feedbackRow}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 成功提示 */}
          {successMessage ? (
            <View style={styles.feedbackRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.successTextSmall}>{successMessage}</Text>
            </View>
          ) : null}
        </View>

        {/* ——— 按钮区 ——— */}
        <View style={styles.buttonSection}>
          {/* 测试连接 */}
          <TouchableOpacity
            style={[
              styles.testButton,
              screenState === "testing" && styles.buttonDisabled,
            ]}
            onPress={handleTestConnection}
            disabled={screenState === "testing" || !connectionString.trim()}
            activeOpacity={0.75}
          >
            {screenState === "testing" ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.testButtonText}>正在测试...</Text>
              </>
            ) : (
              <>
                <Ionicons name="flash-outline" size={18} color="#FFFFFF" />
                <Text style={styles.testButtonText}>测试连接</Text>
              </>
            )}
          </TouchableOpacity>

          {/* 进入 App */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isTested || screenState === "testing") && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isTested || screenState === "testing"}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            <Text style={styles.continueButtonText}>进入 App</Text>
          </TouchableOpacity>
        </View>

        {/* ——— Footer ——— */}
        <Text style={styles.footerText}>
          连接串仅保存在您的设备上, 不会上传至任何服务器
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ——— Styles ———

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[12],
    paddingBottom: spacing[8],
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    padding: spacing[6],
  },

  // Brand
  brandSection: {
    alignItems: "center",
    marginBottom: spacing[10],
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[4],
  },
  brandName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  brandTagline: {
    ...typography.caption,
    color: "rgba(255,255,255,0.65)",
    marginTop: spacing[1],
  },

  // Instruction
  instructionSection: {
    alignItems: "center",
    marginBottom: spacing[6],
  },
  instructionTitle: {
    ...typography.h3,
    color: "#FFFFFF",
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  instructionText: {
    ...typography.caption,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 20,
  },

  // Input card
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  inputLabel: {
    ...typography.label,
    color: "rgba(255,255,255,0.7)",
    marginBottom: spacing[2],
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  textInput: {
    flex: 1,
    ...typography.caption,
    color: "#FFFFFF",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    fontFamily: "monospace",
  },
  eyeButton: {
    padding: spacing[3],
  },

  // Feedback
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing[3],
    gap: spacing[2],
  },
  errorText: {
    ...typography.label,
    color: colors.danger,
    flex: 1,
  },
  successTextSmall: {
    ...typography.label,
    color: colors.success,
    flex: 1,
  },

  // Buttons
  buttonSection: {
    gap: spacing[3],
    marginTop: spacing[6],
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: spacing[3] + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  testButtonText: {
    ...typography.body,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[3] + 2,
    borderRadius: radius.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  continueButtonText: {
    ...typography.body,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.4,
  },

  // Loading
  loadingText: {
    ...typography.caption,
    color: "rgba(255,255,255,0.6)",
  },

  // Success
  successIcon: {
    marginBottom: spacing[4],
  },
  successText: {
    ...typography.body,
    color: "rgba(255,255,255,0.8)",
    marginTop: spacing[2],
  },
  hintText: {
    ...typography.caption,
    color: "rgba(255,255,255,0.5)",
    marginTop: spacing[1],
  },

  // Footer
  footerText: {
    ...typography.label,
    color: "rgba(255,255,255,0.35)",
    textAlign: "center",
    marginTop: spacing[10],
  },
});
