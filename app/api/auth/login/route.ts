import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/userStore';
import { createToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { account, password } = await req.json();
    const result = await loginUser(account, password);

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const token = createToken({
      id: result.user.id,
      email: result.user.email,
      nickname: result.user.nickname,
    });

    const res = NextResponse.json(
      { user: result.user, _hint: 'cookie_set' }
    );
    res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    res.cookies.set('tk_test', token.substring(0, 20), { sameSite: 'lax', path: '/', maxAge: 60 });
    return res;
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error('登录失败:', msg);
    return NextResponse.json({ error: '服务器错误', detail: msg }, { status: 500 });
  }
}
