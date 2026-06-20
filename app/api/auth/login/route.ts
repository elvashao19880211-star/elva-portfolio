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

    // 生成 JWT token
    const token = createToken({
      id: result.user.id,
      email: result.user.email,
      nickname: result.user.nickname,
    });

    const cookieValue = `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
    return NextResponse.json(
      { user: result.user },
      { headers: { 'Set-Cookie': cookieValue } }
    );
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error('登录失败:', msg);
    return NextResponse.json({ error: '服务器错误', detail: msg }, { status: 500 });
  }
}
