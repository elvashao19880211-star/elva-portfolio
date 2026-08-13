import { NextRequest } from 'next/server';
import { verifyNotify } from '@/lib/alipay';
import { getOrder, markOrderPaid } from '@/lib/orderStore';

/**
 * 支付宝异步通知回调（POST）
 * 验签通过后更新订单状态，返回 "success" 表示已处理
 */
export async function POST(req: NextRequest) {
  try {
    const publicKey = process.env.ALIPAY_PUBLIC_KEY;
    const appId = process.env.ALIPAY_APP_ID;
    if (!publicKey) {
      return new Response('failure', { status: 503 });
    }

    // 支付宝以 application/x-www-form-urlencoded 发送
    const text = await req.text();
    const params: Record<string, string> = {};
    for (const [k, v] of new URLSearchParams(text)) {
      params[k] = v;
    }

    const check = verifyNotify(params, publicKey, appId || undefined);
    if (!check.valid) {
      console.error('payment/notify 验签失败:', check.reason);
      return new Response('failure', { status: 400 });
    }

    const outTradeNo = params.out_trade_no;
    const totalAmount = params.total_amount;

    if (!outTradeNo) {
      return new Response('failure', { status: 400 });
    }

    const order = await getOrder(outTradeNo);
    if (!order) {
      console.error('payment/notify 订单不存在:', outTradeNo);
      return new Response('failure', { status: 404 });
    }

    // 金额校验（防止篡改）
    if (totalAmount && Number(totalAmount) !== order.amount) {
      console.error('payment/notify 金额不匹配:', outTradeNo, totalAmount, order.amount);
      return new Response('failure', { status: 400 });
    }

    if (order.status !== 'paid') {
      await markOrderPaid(outTradeNo);
      console.log('payment/notify 支付成功:', outTradeNo, order.title);
    }

    return new Response('success');
  } catch (e: any) {
    console.error('payment/notify error:', e?.message || e);
    return new Response('failure', { status: 500 });
  }
}
