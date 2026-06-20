import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const tokenCookie = req.cookies.get('token');
  const tokenValue = tokenCookie?.value;
  const payload = tokenValue ? verifyToken(tokenValue) : null;

  return NextResponse.json({
    env: {
      ALI_ACCESS_KEY_ID: !!process.env.ALI_ACCESS_KEY_ID,
      ALI_ACCESS_KEY_SECRET: !!process.env.ALI_ACCESS_KEY_SECRET,
      ALI_DM_ACCOUNT: process.env.ALI_DM_ACCOUNT || '(not set)',
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    },
    cookie: {
      hasToken: !!tokenValue,
      tokenPreview: tokenValue ? tokenValue.substring(0, 30) + '...' : null,
      tokenLength: tokenValue?.length || 0,
      payload: payload ? { id: payload.id, nickname: payload.nickname } : null,
    },
    headers: {
      cookie: req.headers.get('cookie') ? 'present' : 'absent',
    },
  });
}
