import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'hetu-verify-secret-2026';

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
