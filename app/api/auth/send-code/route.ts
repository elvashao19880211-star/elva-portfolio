import { NextRequest, NextResponse } from 'next/server';
import { generateVerification } from '@/lib/verificationStore';
import { sendVerificationCode } from '@/lib/email';
import { userExistsByEmail } from '@/lib/userStore';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();
    const isReset = purpose === 'reset';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '请提供有效的邮箱地址' }, { status: 400 });
    }

    // ===== 限流（防邮件轰炸 / 防刷爆邮件额度）=====
    const emailKey = email.trim().toLowerCase();
    const ip = getClientIp(req);

    // 同一 IP：每小时最多 30 次（宽鬆，避免同 WiFi 多人注册误伤）
    const ipLimit = await rateLimit(`sc:ip:${ip}`, 30, 3600);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试', retryAfter: ipLimit.retryAfter },
        { status: 429 }
      );
    }
    // 同一邮箱：60 秒内只能 1 次
    const emailFast = await rateLimit(`sc:email:fast:${emailKey}`, 1, 60);
    if (!emailFast.allowed) {
      return NextResponse.json(
        { error: '验证码已发送，请 60 秒后再试', retryAfter: emailFast.retryAfter },
        { status: 429 }
      );
    }
    // 同一邮箱：24 小时最多 10 次
    const emailDaily = await rateLimit(`sc:email:day:${emailKey}`, 10, 86400);
    if (!emailDaily.allowed) {
      return NextResponse.json(
        { error: '该邮箱今日发送次数过多，请明天再试', retryAfter: emailDaily.retryAfter },
        { status: 429 }
      );
    }

    // 忘记密码流程：校验邮箱是否已注册，避免向陌生人发信
    if (isReset) {
      const exists = await userExistsByEmail(email);
      if (!exists) {
        return NextResponse.json({ error: '该邮箱尚未注册' }, { status: 404 });
      }
    }

    // 生成验证码和令牌
    const { code, token } = generateVerification(email);

    // 发送邮件
    const result = await sendVerificationCode(email, code, isReset ? 'reset' : 'register');

    if (!result.success) {
      // 本地开发无阿里云时仍可继续（验证码打印在控制台）
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ token, hint: `开发模式，验证码: ${code}` });
      }
      return NextResponse.json({ error: result.error || '发送失败，请稍后重试' }, { status: 500 });
    }

    return NextResponse.json({ token, sent: true });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
