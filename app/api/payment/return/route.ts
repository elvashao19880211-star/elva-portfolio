import { NextRequest } from 'next/server';
import { getOrder } from '@/lib/orderStore';

/**
 * 支付宝同步跳转（GET）— 用户支付完成后浏览器跳回这里
 */
export async function GET(req: NextRequest) {
  const outTradeNo = req.nextUrl.searchParams.get('out_trade_no') || '';

  let status: 'success' | 'pending' = 'pending';
  let title = '支付结果';

  if (outTradeNo) {
    const order = await getOrder(outTradeNo);
    if (order) {
      title = order.title;
      if (order.status === 'paid') status = 'success';
    }
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${status === 'success' ? '支付成功' : '支付确认中'}</title>
<style>
  body { font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; background:#F5F3EE; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
  .card { background:#fff; border-radius:16px; padding:48px 40px; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,.06); max-width:420px; }
  .icon { font-size:56px; }
  h1 { font-size:20px; color:#3A506B; margin:16px 0 8px; }
  p { color:#8a8a8a; font-size:14px; margin:0 0 24px; }
  a { display:inline-block; background:#7BC4D0; color:#fff; text-decoration:none; padding:12px 32px; border-radius:8px; font-size:14px; }
  a:hover { background:#5fb3c0; }
</style>
</head>
<body>
<div class="card">
  <div class="icon">${status === 'success' ? '✅' : '⏳'}</div>
  <h1>${status === 'success' ? '支付成功' : '支付确认中'}</h1>
  <p>${status === 'success' ? `「${title}」已到账，感谢支持！` : `「${title}」正在确认到账，请稍候片刻后返回会员中心查看。`}</p>
  <a href="/member">返回会员中心</a>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
