// ============================================================
// DB 连接配置 — 客户端持久化存储 (expo-secure-store)
// 用于存储用户配置的 PostgreSQL 连接串, 在首次启动和设置页使用.
// ============================================================

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const DB_CONNECTION_STRING_KEY = "jh_quant_db_connection_string";

function getWebStorage(): Storage | null {
  if (Platform.OS !== "web") return null;

  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    // 浏览器隐私设置可能会阻止访问 localStorage.
    return null;
  }
}

/**
 * 保存数据库连接串到设备安全存储.
 * Web 不支持 expo-secure-store, 使用浏览器本地存储作为降级方案.
 */
export async function saveConnectionString(connectionString: string): Promise<void> {
  if (Platform.OS === "web") {
    const storage = getWebStorage();
    if (!storage) {
      throw new Error("当前环境不支持本地存储, 无法保存数据库连接串");
    }
    storage.setItem(DB_CONNECTION_STRING_KEY, connectionString);
    return;
  }

  await SecureStore.setItemAsync(DB_CONNECTION_STRING_KEY, connectionString);
}

/**
 * 读取已保存的数据库连接串.
 * 返回 null 表示用户尚未配置.
 */
export async function getConnectionString(): Promise<string | null> {
  if (Platform.OS === "web") {
    return getWebStorage()?.getItem(DB_CONNECTION_STRING_KEY) ?? null;
  }

  return SecureStore.getItemAsync(DB_CONNECTION_STRING_KEY);
}

/**
 * 删除已保存的数据库连接串 (用户登出 / 重置).
 */
export async function deleteConnectionString(): Promise<void> {
  if (Platform.OS === "web") {
    getWebStorage()?.removeItem(DB_CONNECTION_STRING_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(DB_CONNECTION_STRING_KEY);
}

/**
 * 检查是否已完成数据库配置.
 */
export async function hasConnectionString(): Promise<boolean> {
  const val = await getConnectionString();
  return val !== null && val.length > 0;
}
