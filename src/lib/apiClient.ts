// 每次数据请求携带设备安全存储的连接串，保证无状态 API 实例也可查询。
import { getConnectionString } from "./dbConfig";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const connectionString = await getConnectionString();
  const headers = new Headers(init?.headers);

  if (connectionString) headers.set("x-jh-quant-db-url", connectionString);

  return fetch(input, { ...init, headers });
}
