import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/userStore';
import { createToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { account, password } = await req.json();

    // ===== 防暴力破解：同一 IP + 账号 15 分钟内最多 8 次尝试 =====
    const ip = getClientIp(req);
    const accountKey = String(account || '').trim().toLowerCase().slice(0, 64);
    const attempt = await rateLimit(`login:${ip}:${accountKey}`, 8, 900);
    if (!attempt.allowed) {
      return NextResponse.json(
        { error: '尝试次数过多，请 15 分钟后再试', retryAfter: attempt.retryAfter },
        { status: 429 }
      );
    }

    const result = await loginUser(account, password);

    if (!result.success || !result.user) {
      // 统一错误文案，避免泄露账号是否存在
      return NextResponse.json({ error: '账号或密码错误' }, { status: 401 });
    }

    const token = createToken({
      id: result.user.id,
      email: result.user.email,
      nickname: result.user.nickname,
    });

    const res = NextResponse.json(
      { user: result.user, _hint: 'cookie_set' }
    );
    res.cookies.set('token', token, { httpOnly: true, sameSite: 'none', path: '/', maxAge: 60 * 60 * 24 * 7, secure: true });
    return res;
  } catch (error: any) {
    console.error('登录失败:', error?.message || error);
    return NextResponse.json({ error: '服务器错误，请稍后重试' }, { status: 500 });
  }
}
