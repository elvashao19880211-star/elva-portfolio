import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/userStore';
import { verifyCode } from '@/lib/verificationStore';

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
