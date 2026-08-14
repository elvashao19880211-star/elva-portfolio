import { NextRequest, NextResponse } from 'next/server';
import { getPaidPatternsByEmail } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 已购纹样查询（按邮箱，用于详情页「已购」状态）
 * GET /api/payment/owned?email=xxx -> { patterns: [{ id, tier, type, title, src }] }
 */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase();
    if (!email) return NextResponse.json({ patterns: [] });

    const orders = await getPaidPatternsByEmail(email);
    const patterns = orders.map((o) => ({
      id: o.planId,
      tier: o.tier || 'personal',
      type: o.patternType || 'revival',
      title: o.title,
      src: o.src || '',
    }));

    return NextResponse.json({ patterns });
  } catch (e: any) {
    console.error('owned error:', e?.message || e);
    return NextResponse.json({ patterns: [] });
  }
}
