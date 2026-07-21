// ============================================================
// 格式化工具 — 数字/日期/百分比
// ============================================================

/**
 * 金额格式化: ¥123,456.78
 * 大于 1000万 自动缩写为 万/亿 便于 KPI 卡片展示
 */
export function formatCurrency(value: number, decimals = 2): string {
  const abs = Math.abs(value);
  if (abs >= 1e8) {
    return `${value >= 0 ? "¥" : "-¥"}${(abs / 1e8).toFixed(decimals)}亿`;
  }
  if (abs >= 1e7) {
    return `${value >= 0 ? "¥" : "-¥"}${(abs / 1e4).toFixed(decimals)}万`;
  }
  return `${value >= 0 ? "¥" : "-¥"}${abs.toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * 交易金额格式化: ¥123,456.78 (完整数字，不缩写)
 * 用于交易记录等需要精确金额的场景
 */
export function formatTradeAmount(value: number, decimals = 2): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${value >= 0 ? "¥" : "-¥"}${formatted}`;
}

/**
 * 百分比格式化: +35.82% / -12.50%
 */
export function formatPercent(value: number, decimals = 2): string {
  const pct = value * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(decimals)}%`;
}

/**
 * 普通数字千分位: 12,345
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 大数字简写: 31.6万 / 1.2亿
 */
export function formatLargeNumber(value: number, decimals = 1): string {
  const abs = Math.abs(value);
  if (abs >= 1e8) return `${(value / 1e8).toFixed(decimals)}亿`;
  if (abs >= 1e4) return `${(value / 1e4).toFixed(decimals)}万`;
  return value.toFixed(decimals);
}

/**
 * 日期格式化: ISO string → 07-18 或 2026-07-18
 */
export function formatDate(dateStr: string, full = false): string {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  if (full) {
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  return `${mm}-${dd}`;
}

/**
 * 日期时间格式化: ISO string → 07-18 14:30
 */
export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}-${dd} ${hh}:${mi}`;
}

/**
 * 比率格式化: 1.85
 */
export function formatRatio(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

/**
 * 成交量/持仓量格式化: 200股 / 500手
 */
export function formatVolume(value: number): string {
  if (value >= 1e4) return `${(value / 1e4).toFixed(1)}万`;
  return formatNumber(value, 0);
}

/**
 * 获取涨跌符号
 */
export function getChangeSymbol(value: number): string {
  if (value > 0) return "+";
  if (value < 0) return "";
  return "";
}

/**
 * 时长格式化: ms → "1h 30m"
 */
export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
