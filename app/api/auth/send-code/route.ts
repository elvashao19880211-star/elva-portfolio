import { NextRequest, NextResponse } from 'next/server';
import { generateVerification } from '@/lib/verificationStore';
import { sendVerificationCode } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '请提供有效的邮箱地址' }, { status: 400 });
    }

    // 生成验证码和令牌
    const { code, token } = generateVerification(email);

    // 发送邮件
    const result = await sendVerificationCode(email, code);

    if (!result.success) {
      // 本地开发无阿里云时仍可继续（验证码打印在控制台）
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ token, hint: `开发模式，验证码: ${code}` });
      }
      return NextResponse.json({ error: result.error || '发送失败，请稍后重试' }, { status: 500 });
    }

    return NextResponse.json({ token, code, sent: true });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
