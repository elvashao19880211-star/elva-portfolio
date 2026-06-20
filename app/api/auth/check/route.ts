import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/userStore';

export async function GET(req: NextRequest) {
  const steps: string[] = [];
  
  // Step 1: cookie
  const token = req.cookies.get('token')?.value;
  steps.push(`cookie=${!!token}`);
  if (!token) {
    return NextResponse.json({ step: 'no_cookie', steps });
  }

  // Step 2: verify
  const payload = verifyToken(token);
  steps.push(`verify=${!!payload}`);
  if (!payload) {
    return NextResponse.json({ step: 'verify_failed', steps, tokenLen: token.length });
  }

  // Step 3: db
  const user = await getUserById(payload.id);
  steps.push(`db=${!!user}`);

  return NextResponse.json({ step: 'ok', steps, userId: payload.id, user });
}
