import crypto from 'crypto';

// ⚠️ 安全：生产环境必须设置 JWT_SECRET，否则会回退到公开的默认密钥（验证码令牌可被伪造）
const ENV_SECRET = process.env.JWT_SECRET || '';
if (!ENV_SECRET && process.env.NODE_ENV === 'production') {
  console.error(
    '[安全告警] 未设置 JWT_SECRET 环境变量！验证码令牌正在使用不安全的默认密钥，请立即到 Vercel 配置 JWT_SECRET。'
  );
}
const SECRET = ENV_SECRET || 'hetu-verify-secret-2026';

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url');
}

function createJWT(payload: Record<string, any>, expiresInMs: number): string {
  const p = { ...payload, exp: Date.now() + expiresInMs };
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(p));
  const data = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, b, s] = parts;
    const data = `${h}.${b}`;
    const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(s, 'base64url'), Buffer.from(expected, 'base64url'))) return null;
    const payload = JSON.parse(Buffer.from(b, 'base64url').toString());
    return payload;
  } catch { return null; }
}

/**
 * 生成验证码并创建临时令牌（无服务端存储）
 */
export function generateVerification(email: string): { code: string; token: string } {
  const code = String(Math.floor(100000 + Math.random() * 900000));

  const codeHash = crypto.createHmac('sha256', SECRET)
    .update(`${email.toLowerCase()}:${code}`)
    .digest('hex');

  const token = createJWT({ email: email.toLowerCase(), codeHash }, 10 * 60 * 1000);
  return { code, token };
}

/**
 * 校验验证码
 */
export function verifyCode(email: string, code: string, token: string): boolean {
  const payload = verifyJWT(token);
  if (!payload || !payload.codeHash || !payload.email) return false;
  if (payload.email !== email.toLowerCase()) return false;

  const expectedHash = crypto.createHmac('sha256', SECRET)
    .update(`${payload.email}:${code}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedHash),
    Buffer.from(payload.codeHash)
  );
}
