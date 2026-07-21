// ============================================================
// POST /api/db-connect — 测试数据库连通性并初始化全局 Pool
//
// 请求体: { connectionString: string }
// 成功返回: { success: true, message: string }
// 失败返回: { success: false, error: string }
// ============================================================

import { Pool } from "pg";
import { initPool } from "../../src/lib/db";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { connectionString } = body as { connectionString?: string };

    if (!connectionString || typeof connectionString !== "string") {
      return Response.json(
        { success: false, error: "connectionString is required" },
        { status: 400 }
      );
    }

    // 基本格式校验
    if (!connectionString.startsWith("postgresql://") && !connectionString.startsWith("postgres://")) {
      return Response.json(
        { success: false, error: "连接串必须以 postgresql:// 或 postgres:// 开头" },
        { status: 400 }
      );
    }

    // 使用临时连接测试连通性 (不依赖全局 Pool)
    const testPool = new Pool({
      connectionString,
      max: 1,
      connectionTimeoutMillis: 8_000,
      idleTimeoutMillis: 10_000,
    });

    try {
      const result = await testPool.query("SELECT 1 AS ok, version() AS pg_version");
      const pgVersion = result.rows[0]?.pg_version || "unknown";

      // 测试成功 → 初始化全局 Pool
      initPool(connectionString);

      return Response.json({
        success: true,
        message: "数据库连接成功",
        pgVersion,
      });
    } finally {
      // 关闭临时连接
      await testPool.end().catch(() => {});
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: `数据库连接失败: ${message}` },
      { status: 200 } // 200 以便客户端解析错误信息 (非 HTTP 错误)
    );
  }
}
