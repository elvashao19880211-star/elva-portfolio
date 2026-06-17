import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname, phone } = await req.json();
    const result = await registerUser(email, phone, password, nickname);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ user: result.user });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
