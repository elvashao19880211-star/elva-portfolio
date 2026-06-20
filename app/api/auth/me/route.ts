import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/userStore';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const user = await getUserById(payload.id);
    return NextResponse.json({ user });
  } catch (e: any) {
    console.error('me route error:', e?.message || String(e));
    return NextResponse.json({ user: null, _error: e?.message || String(e) });
  }
}
