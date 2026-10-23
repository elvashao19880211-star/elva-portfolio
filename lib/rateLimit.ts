import { Redis } from '@upstash/redis';

/**
 * 通用限流 / 计数器
 * - 生产（有 Upstash Redis）：Redis INCR + EXPIRE，跨实例生效
 * - 本地开发 / Redis 不可用：进程内存兜底（重启清零，够用）
 */

const hasRedis = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (!hasRedis) return null;
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

// ===== 内存兜底 =====
const memStore = new Map<string, { count: number; resetAt: number }>();

function memBump(key: string, windowSec: number): { count: number; ttl: number } {
  const now = Date.now();
  const cur = memStore.get(key);
  if (!cur || cur.resetAt <= now) {
    memStore.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    // 顺手清理过期键，避免内存无限增长
    if (memStore.size > 5000) {
      for (const [k, v] of memStore) if (v.resetAt <= now) memStore.delete(k);
    }
    return { count: 1, ttl: windowSec };
  }
  cur.count += 1;
  return { count: cur.count, ttl: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)) };
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // 秒
}

/**
 * 在 windowSec 秒窗口内最多允许 limit 次
 * @param key 唯一键（建议含场景前缀 + IP/邮箱）
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const r = getRedis();
  try {
    if (r) {
      const count = await r.incr(key);
      if (count === 1) await r.expire(key, windowSec);
      let ttl = await r.ttl(key);
      if (ttl === null || ttl < 0) ttl = windowSec;
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        retryAfter: ttl,
      };
    }
  } catch (e: any) {
    console.error('rateLimit redis error:', e?.message || e);
    // Redis 异常时降级到内存，不让整站功能瘫痪
  }
  const { count, ttl } = memBump(key, windowSec);
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfter: ttl,
  };
}

/** 从请求头解析客户端 IP（Vercel: x-forwarded-for） */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

/** 限流失败时的统一 429 响应体 */
export function tooMany(retryAfter: number, message = '操作过于频繁，请稍后再试') {
  return {
    error: message,
    retryAfter,
  };
}
