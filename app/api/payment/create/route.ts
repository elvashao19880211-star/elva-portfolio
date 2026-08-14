import { NextRequest, NextResponse } from 'next/server';
import { buildPagePayUrl } from '@/lib/alipay';
import { createOrder } from '@/lib/orderStore';

const SITE_URL = 'https://www.hetu-pattern.com';

export async function POST(req: NextRequest) {
  try {
    const appId = (process.env.ALIPAY_APP_ID || '').trim();
    const privateKey = (process.env.ALIPAY_PRIVATE_KEY || '').trim();
    if (!appId || !privateKey) {
      return NextResponse.json(
        { error: '支付服务未配置（缺少 ALIPAY_APP_ID 或 ALIPAY_PRIVATE_KEY）' },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: '请求体无效' }, { status: 400 });

    const { type, planId, tier, title, amount, userEmail, src, patternType } = body as {
      type?: 'member' | 'pattern';
      planId?: string;
      tier?: string;
      title?: string;
      amount?: number;
      userEmail?: string;
      src?: string;
      patternType?: 'revival' | 'innovation';
    };

    if (type !== 'member' && type !== 'pattern') {
      return NextResponse.json({ error: '订单类型无效' }, { status: 400 });
    }
    if (!planId || !title) {
      return NextResponse.json({ error: '缺少商品信息' }, { status: 400 });
    }
    const amt = Number(amount);
    if (!amt || amt <= 0 || isNaN(amt)) {
      return NextResponse.json({ error: '金额无效' }, { status: 400 });
    }

    // 生成商户订单号：HT + 时间戳 + 6位随机
    const ts = Date.now().toString();
    const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const outTradeNo = `HT${ts}${rand}`;

    const totalAmount = amt.toFixed(2);

    await createOrder({
      outTradeNo,
      type,
      planId: String(planId),
      tier: tier || undefined,
      title,
      amount: Number(totalAmount),
      status: 'pending',
      userEmail: userEmail || undefined,
      src: src || undefined,
      patternType: patternType || undefined,
      createdAt: new Date().toISOString(),
    });

    const payUrl = buildPagePayUrl({
      appId,
      privateKey,
      outTradeNo,
      totalAmount,
      subject: title,
      notifyUrl: `${SITE_URL}/api/payment/notify`,
      returnUrl: `${SITE_URL}/api/payment/return?out_trade_no=${outTradeNo}`,
    });

    return NextResponse.json({ payUrl, outTradeNo });
  } catch (e: any) {
    console.error('payment/create error:', e?.message || e);
    return NextResponse.json({ error: '创建支付订单失败' }, { status: 500 });
  }
}
