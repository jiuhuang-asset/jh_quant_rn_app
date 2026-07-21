// ============================================================
// 应用常量
// ============================================================

/** 品牌名 */
export const BRAND_NAME = "JH_QUANT";

/** 品牌标语 (中文) */
export const BRAND_TAGLINE_ZH = "您的私人量化助手";

/** 品牌标语 (英文) */
export const BRAND_TAGLINE_EN = "Your Personal Quant Assistant";

/** API 基础路径 (Expo API Routes 同域) */
export const API_BASE = "/api";

/** 数据自动刷新间隔 (ms) — 新加坡 DB: 降低轮询频率 */
export const REFETCH_INTERVAL = 300_000; // 5min

/** TanStack Query stale 时间 (ms) — 数据在 5min 内视为新鲜，不重复请求 */
export const STALE_TIME = 300_000; // 5min

/** TanStack Query gc 时间 (ms) — 缓存保留 30min，页面切换时复用数据 */
export const GC_TIME = 1_800_000; // 30min

/** 默认分页大小 */
export const PAGE_SIZE = 20;

/** 图表默认高度 */
export const CHART_HEIGHT = 220;

/** App 版本 */
export const APP_VERSION = "1.0.0";
