import { NextRequest, NextResponse } from 'next/server';
import { generateVerification } from '@/lib/verificationStore';
import { sendVerificationCode } from '@/lib/email';
import { userExistsByEmail } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();
    const isReset = purpose === 'reset';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '请提供有效的邮箱地址' }, { status: 400 });
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
