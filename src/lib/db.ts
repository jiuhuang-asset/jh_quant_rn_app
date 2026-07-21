// ============================================================
// 数据库连接层 — Neon PG (server-side only)
// 仅用于 Expo API Routes (app/api/*.ts), 不在客户端 bundle 中
//
// Pool 采用延迟初始化: 用户在首次启动时输入 DB 连接串,
// 通过 POST /api/db-connect 测试连通性并初始化全局 Pool.
// 后续所有 API Route 共享同一个 Pool 实例.
// ============================================================

import { Pool } from "pg";

let pool: Pool | null = null;

/**
 * 初始化 (或重新初始化) 全局数据库连接池.
 * 在首次启动或用户在设置中修改连接串时调用.
 * 如果已有旧 Pool, 先关闭再替换.
 */
export function initPool(connectionString: string): void {
  if (pool) {
    pool.end().catch(() => {
      // 忽略旧 Pool 关闭错误
    });
  }
  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

/**
 * 获取当前 Pool 实例 (可能为 null, 表示尚未初始化).
 */
export function getPool(): Pool | null {
  return pool;
}

/**
 * Pool 是否已就绪.
 */
export function isPoolReady(): boolean {
  return pool !== null;
}

/**
 * 执行 SQL 查询, 返回泛型数组.
 * 若 Pool 未初始化则抛出错误.
 */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  if (!pool) {
    throw new Error(
      "Database pool is not initialized. Please configure your database connection first."
    );
  }
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * 执行 SQL 查询, 返回单行或 null.
 */
export async function queryOne<T>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * 数据库连接健康检查 (使用当前 Pool).
 */
export async function healthCheck(): Promise<boolean> {
  if (!pool) return false;
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/**
 * 关闭连接池 (用于优雅退出).
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
