import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// ⚠️ 安全：生产环境必须设置 AUTH_SECRET，否则会回退到公开的默认密钥（登录态可被伪造）
const ENV_SECRET = process.env.AUTH_SECRET || '';
if (!ENV_SECRET && process.env.NODE_ENV === 'production') {
  console.error(
    '[安全告警] 未设置 AUTH_SECRET 环境变量！登录凭证正在使用不安全的默认密钥，请立即到 Vercel 配置 AUTH_SECRET。'
  );
}
const SECRET = ENV_SECRET || 'hetu-pattern-local-dev-secret-2026';

export interface UserPayload {
  id: string;
  email?: string;
  nickname: string;
}

// 简单的 JWT 生成（无需额外依赖）
function base64url(str: string): string {
  return Buffer.from(str).toString('base64url');
}

/** 登录凭证有效期：7 天（与 cookie maxAge 一致） */
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createToken(payload: UserPayload): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS }));
  const data = `${header}.${body}`;
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, bodyB64, sigB64] = parts;
    const data = `${headerB64}.${bodyB64}`;
    const expectedSig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');

    // 恒定时间比较
    const sigOk = crypto.timingSafeEqual(
      Buffer.from(sigB64, 'base64url'),
      Buffer.from(expectedSig, 'base64url')
    );
    if (!sigOk) return null;

    const payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString());
    // 过期校验：无 exp 的旧凭证一律视为过期，强制重新登录
    if (!payload.exp || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return null;
    }
    return { id: payload.id, email: payload.email, nickname: payload.nickname };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
