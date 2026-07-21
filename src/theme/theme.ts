// ============================================================
// JH_QUANT 主题系统 — 基于 DESIGN.md v1
// 品牌色: #154587 (深海军蓝)
// ============================================================

import { TextStyle, ViewStyle } from "react-native";

// ——— 色彩 ———

export const colors = {
  primary: {
    50: "#E8F0FA",
    100: "#C5D8F0",
    200: "#9DBFE6",
    300: "#72A3DB",
    400: "#4A88D0",
    500: "#154587",
    600: "#113A6F",
    700: "#0D2E58",
    800: "#0A2342",
    900: "#06172D",
  },

  // 涨跌色 (红涨绿跌, A股习惯)
  up: "#DC2626",
  upLight: "#FEE2E2",
  down: "#16A34A",
  downLight: "#DCFCE7",

  // 语义色
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#0EA5E9",

  // 中性色
  gray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // 布局
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",

  // 文字
  text: {
    primary: "#0F172A",
    secondary: "#334155",
    tertiary: "#64748B",
    disabled: "#94A3B8",
    inverse: "#FFFFFF",
  },
} as const;

// ——— 图表色板 (DataViz Palette, 色盲友好) ———

export const chartColors = [
  "#154587",
  "#2E86AB",
  "#A23B72",
  "#F18F01",
  "#C73E1D",
  "#6A994E",
  "#386641",
  "#BC4742",
  "#264653",
  "#E9C46A",
] as const;

// ——— 暗色模式色彩 ———

export const darkColors = {
  background: "#0F172A", // gray-900
  surface: "#1E293B", // gray-800
  border: "#334155", // gray-700
  text: {
    primary: "#F8FAFC", // gray-50
    secondary: "#CBD5E1", // gray-300
    tertiary: "#94A3B8", // gray-400
    disabled: "#64748B", // gray-500
    inverse: "#0F172A",
  },
  primary: {
    50: "#06172D",
    100: "#0A2342",
    200: "#0D2E58",
    300: "#113A6F",
    400: "#4A88D0",
    500: "#4A88D0",
    600: "#72A3DB",
    700: "#9DBFE6",
    800: "#C5D8F0",
    900: "#E8F0FA",
  },
} as const;

// ——— 间距 (4px 栅格) ———

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

// ——— 圆角 ———

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

// ——— 字号 ———

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

// ——— 行高 ———

export const lineHeight = {
  xs: 15,
  sm: 20,
  base: 24,
  lg: 27,
  xl: 28,
  "2xl": 32,
  "3xl": 39,
  "4xl": 43,
} as const;

// ——— 字重 ———

export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

// ——— 字体栈 ———

export const fontFamily = {
  sans: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif",
  mono: "SF Mono, JetBrains Mono, Noto Sans Mono SC, monospace",
  number: "DIN Alternate, SF Pro Display, PingFang SC, monospace",
};

// ——— 阴影 (React Native + Web) ———
// RN Web 0.20+ 推荐使用 boxShadow，同时保留 shadow* 兼容原生端

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.04)",
  } as ViewStyle,
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
  } as ViewStyle,
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
  } as ViewStyle,
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
  } as ViewStyle,
};

// ——— 动效时长 ———

export const duration = {
  fast: 150,
  normal: 250,
  slow: 400,
  chart: 800,
} as const;

// ——— 排版预设 ———

export const typography = {
  /** KPI 大数字 */
  kpi: {
    fontSize: fontSize["3xl"],
    lineHeight: lineHeight["3xl"],
    fontWeight: fontWeight.bold,
  } as TextStyle,
  /** 页面标题 */
  h1: {
    fontSize: fontSize["2xl"],
    lineHeight: lineHeight["2xl"],
    fontWeight: fontWeight.bold,
  } as TextStyle,
  /** Section 标题 */
  h2: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  /** 卡片标题 */
  h3: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  /** 正文 */
  body: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: fontWeight.normal,
  } as TextStyle,
  /** 辅助文字 */
  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.normal,
  } as TextStyle,
  /** 标签/注释 */
  label: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.medium,
  } as TextStyle,
  /** 表格数字 */
  tabular: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.normal,
  } as TextStyle,
} as const;

// ——— 完整 Theme 对象 (统一导出) ———

export const theme = {
  colors,
  darkColors,
  spacing,
  radius,
  fontSize,
  lineHeight,
  fontWeight,
  fontFamily,
  shadow,
  duration,
  typography,
  chartColors,
} as const;

export type Theme = typeof theme;
