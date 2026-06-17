import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const SECRET = process.env.AUTH_SECRET || 'hetu-pattern-local-dev-secret-2026';

export interface UserPayload {
  id: string;
  email?: string;
  nickname: string;
}

// 简单的 JWT 生成（无需额外依赖）
function base64url(str: string): string {
  return Buffer.from(str).toString('base64url');
}

export function createToken(payload: UserPayload): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
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
