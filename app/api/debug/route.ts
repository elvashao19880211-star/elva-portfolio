import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      ALI_ACCESS_KEY_ID: !!process.env.ALI_ACCESS_KEY_ID,
      ALI_ACCESS_KEY_SECRET: !!process.env.ALI_ACCESS_KEY_SECRET,
      ALI_DM_ACCOUNT: process.env.ALI_DM_ACCOUNT || '(not set)',
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
}
