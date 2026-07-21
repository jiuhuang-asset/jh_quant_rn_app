// ============================================================
// 数据库连接层 — Neon PG (server-side only)
// 仅用于 Expo API Routes (app/api/*.ts), 不在客户端 bundle 中
// ============================================================

import "./env"; // 自动加载 .env.local (必须先于 Pool 初始化)
import { Pool, PoolClient, QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_PG_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

/**
 * 执行 SQL 查询, 返回泛型数组
 */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const client: PoolClient = await pool.connect();
  try {
    const result: QueryResult<T> = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * 执行 SQL 查询, 返回单行或 null
 */
export async function queryOne<T>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * 数据库连接健康检查
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/**
 * 关闭连接池 (用于优雅退出)
 */
export async function closePool(): Promise<void> {
  await pool.end();
}
