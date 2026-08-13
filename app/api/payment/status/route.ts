import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/orderStore';

/**
 * 查询订单状态（GET）— 前端轮询用，判断支付是否到账
 */
export async function GET(req: NextRequest) {
  const outTradeNo = req.nextUrl.searchParams.get('out_trade_no') || '';
  if (!outTradeNo) {
    return NextResponse.json({ error: '缺少订单号' }, { status: 400 });
  }

  const order = await getOrder(outTradeNo);
  if (!order) {
    return NextResponse.json({ error: '订单不存在' }, { status: 404 });
  }

  return NextResponse.json({
    outTradeNo: order.outTradeNo,
    status: order.status,
    type: order.type,
    title: order.title,
    amount: order.amount,
  });
}
