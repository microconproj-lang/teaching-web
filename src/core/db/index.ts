import net from "node:net";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
};

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://teaching:change_me_db_password@localhost:5432/teaching_web";

// จำกัด Pool ที่ 20 connections เพื่อไม่ให้กิน RAM ของ PostgreSQL บน Raspberry Pi 5 เกินความจำเป็น
export const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

pool.on("error", () => {
  // ป้องกัน unhandled error event จาก idle client ของ pg-pool
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

export const db = drizzle(pool, { schema });
export type Database = typeof db;

/**
 * ตรวจการเชื่อมต่อพอร์ต PostgreSQL แบบเร็ว (ใช้เลี่ยง AggregateError บน Next.js dev เมื่อ DB ยังไม่เปิด)
 */
export async function isDatabaseReachable(timeoutMs = 500): Promise<boolean> {
  try {
    const parsed = new URL(connectionString);
    const host = parsed.hostname === "localhost" ? "127.0.0.1" : parsed.hostname;
    const port = Number(parsed.port || 5432);

    return await new Promise<boolean>((resolve) => {
      const socket = net.createConnection({ host, port });
      const done = (ok: boolean) => {
        socket.removeAllListeners();
        socket.destroy();
        resolve(ok);
      };
      socket.setTimeout(timeoutMs);
      socket.once("connect", () => done(true));
      socket.once("timeout", () => done(false));
      socket.once("error", () => done(false));
    });
  } catch {
    return false;
  }
}

