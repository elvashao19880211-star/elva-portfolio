import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/userStore';
import { verifyCode } from '@/lib/verificationStore';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname, phone, code, token } = await req.json();

    // ===== 限流（防批量注册 / 验证码爆破）=====
    const ip = getClientIp(req);
    const ipLimit = await rateLimit(`reg:ip:${ip}`, 20, 3600);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: '注册请求过于频繁，请稍后再试', retryAfter: ipLimit.retryAfter },
        { status: 429 }
      );
    }

    // 如果提供了邮箱，必须验证。手机号注册暂不强制验证
    if (email) {
      if (!code || !token) {
        return NextResponse.json({ error: '请输入邮箱验证码' }, { status: 400 });
      }
      // 同一邮箱：15 分钟内最多尝试 5 次验证码
      const tryLimit = await rateLimit(`reg:try:${email.toLowerCase()}`, 5, 900);
      if (!tryLimit.allowed) {
        return NextResponse.json(
          { error: '验证码错误次数过多，请 15 分钟后再试', retryAfter: tryLimit.retryAfter },
          { status: 429 }
        );
      }
      if (!verifyCode(email, code, token)) {
        return NextResponse.json({ error: '验证码错误或已过期' }, { status: 400 });
      }
    }

    const result = await registerUser(email, phone, password, nickname);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ user: result.user });
  } catch (error: any) {
    console.error('注册失败:', error?.message || error);
    return NextResponse.json({ error: '服务器错误，请稍后重试' }, { status: 500 });
  }
}
