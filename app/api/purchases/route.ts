import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getPaidPatternsByEmail } from '@/lib/orderStore';
import { getUserById } from '@/lib/userStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 已购纹样查询（服务端权威）
 * GET /api/purchases -> { purchases: PurchaseItem[] }
 * 基于登录态 + 支付订单（paid）返回已购纹样
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ purchases: [] });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ purchases: [] });

    const user = await getUserById(payload.id);
    if (!user?.email) return NextResponse.json({ purchases: [] });

    const orders = await getPaidPatternsByEmail(user.email);
    const purchases = orders
      .filter((o) => o.planId && o.title)
      .map((o) => ({
        id: o.planId,
        title: o.title,
        src: o.src || '',
        type: (o.patternType || 'revival') as 'revival' | 'innovation',
        tier: (o.tier || 'personal') as 'personal' | 'commercial' | 'source',
        price: `¥${o.amount}`,
        purchasedAt: o.paidAt ? new Date(o.paidAt).getTime() : Date.now(),
        email: o.userEmail,
      }));

    return NextResponse.json({ purchases });
  } catch (e: any) {
    console.error('purchases error:', e?.message || e);
    return NextResponse.json({ purchases: [] });
  }
}
