import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/userStore';
import { verifyCode } from '@/lib/verificationStore';

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname, phone, code, token } = await req.json();

    // 如果提供了邮箱，必须验证。手机号注册暂不强制验证
    if (email) {
      if (!code || !token) {
        return NextResponse.json({ error: '请输入邮箱验证码' }, { status: 400 });
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
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
