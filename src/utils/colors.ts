// ============================================================
// 颜色工具 — 涨跌色管理 / 色板 / 透明度
// ============================================================

import { colors, chartColors } from "../theme/theme";

// ——— 涨跌色上下文 ———
// 默认 A 股习惯: 红涨绿跌; 可切换为国际惯例 绿涨红跌

export type ColorScheme = "cn" | "intl"; // cn=红涨绿跌, intl=绿涨红跌

let _colorScheme: ColorScheme = "cn";

export function setColorScheme(scheme: ColorScheme): void {
  _colorScheme = scheme;
}

export function getColorScheme(): ColorScheme {
  return _colorScheme;
}

/** 根据数值返回涨/跌/平色 */
export function upDownColor(value: number | null | undefined): string {
  if (value == null) return colors.gray[400];
  const up = _colorScheme === "cn" ? colors.up : colors.down;
  const down = _colorScheme === "cn" ? colors.down : colors.up;
  if (value > 0) return up;
  if (value < 0) return down;
  return colors.gray[400];
}

/** 上涨色 (根据当前 scheme) */
export function upColor(): string {
  return _colorScheme === "cn" ? colors.up : colors.down;
}

/** 下跌色 (根据当前 scheme) */
export function downColor(): string {
  return _colorScheme === "cn" ? colors.down : colors.up;
}

/** 涨跌背景浅色 */
export function upLightColor(): string {
  return _colorScheme === "cn" ? colors.upLight : colors.downLight;
}

export function downLightColor(): string {
  return _colorScheme === "cn" ? colors.downLight : colors.upLight;
}

// ——— 图表色板 ———

/** 获取图表色板中第 i 个颜色 (循环) */
export function getChartColor(index: number): string {
  return chartColors[index % chartColors.length];
}

/** 获取整个图表色板 */
export function getChartPalette(): readonly string[] {
  return chartColors;
}

// ——— 透明度工具 ———

/** hex → rgba */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** hex → 指定透明度 (React Native 用) */
export function withAlpha(hex: string, alpha: number): string {
  return hexToRgba(hex, alpha);
}
