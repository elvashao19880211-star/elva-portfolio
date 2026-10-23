import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/userStore';
import { verifyCode } from '@/lib/verificationStore';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const { email, password, code, token } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '请提供有效的邮箱地址' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: '新密码至少6位' }, { status: 400 });
    }
    if (!code || !token) {
      return NextResponse.json({ error: '请输入邮箱验证码' }, { status: 400 });
    }

    // ===== 限流（防验证码爆破 / 账号接管）=====
    const emailKey = email.trim().toLowerCase();
    const ip = getClientIp(req);

    // 同一 IP：每小时最多 10 次重置请求
    const ipLimit = await rateLimit(`rp:ip:${ip}`, 10, 3600);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试', retryAfter: ipLimit.retryAfter },
        { status: 429 }
      );
    }
    // 同一邮箱：15 分钟内最多尝试 5 次验证码（防 6 位码爆破）
    const tryLimit = await rateLimit(`rp:try:${emailKey}`, 5, 900);
    if (!tryLimit.allowed) {
      return NextResponse.json(
        { error: '验证码错误次数过多，请 15 分钟后再试', retryAfter: tryLimit.retryAfter },
        { status: 429 }
      );
    }

    if (!verifyCode(email, code, token)) {
      return NextResponse.json({ error: '验证码错误或已过期' }, { status: 400 });
    }

    const result = await resetPassword(email, password);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error('重置密码失败:', msg);
    return NextResponse.json({ error: '服务器错误', detail: msg }, { status: 500 });
  }
}
