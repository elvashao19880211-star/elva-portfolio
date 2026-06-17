import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      ALI_ACCESS_KEY_ID: !!process.env.ALI_ACCESS_KEY_ID,
      ALI_ACCESS_KEY_SECRET: !!process.env.ALI_ACCESS_KEY_SECRET,
      ALI_DM_ACCOUNT: process.env.ALI_DM_ACCOUNT || '(not set)',
      NODE_ENV: process.env.NODE_ENV,
    },
  });
}
