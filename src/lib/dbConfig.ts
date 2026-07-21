// ============================================================
// DB 连接配置 — 客户端持久化存储 (expo-secure-store)
// 用于存储用户配置的 PostgreSQL 连接串, 在首次启动和设置页使用.
// ============================================================

import * as SecureStore from "expo-secure-store";

const DB_CONNECTION_STRING_KEY = "jh_quant_db_connection_string";

/**
 * 保存数据库连接串到设备安全存储.
 */
export async function saveConnectionString(connectionString: string): Promise<void> {
  await SecureStore.setItemAsync(DB_CONNECTION_STRING_KEY, connectionString);
}

/**
 * 读取已保存的数据库连接串.
 * 返回 null 表示用户尚未配置.
 */
export async function getConnectionString(): Promise<string | null> {
  return SecureStore.getItemAsync(DB_CONNECTION_STRING_KEY);
}

/**
 * 删除已保存的数据库连接串 (用户登出 / 重置).
 */
export async function deleteConnectionString(): Promise<void> {
  await SecureStore.deleteItemAsync(DB_CONNECTION_STRING_KEY);
}

/**
 * 检查是否已完成数据库配置.
 */
export async function hasConnectionString(): Promise<boolean> {
  const val = await getConnectionString();
  return val !== null && val.length > 0;
}
