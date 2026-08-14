import { NextRequest } from 'next/server';
import { getOrder } from '@/lib/orderStore';

/**
 * 支付宝同步跳转（GET）— 用户支付完成后浏览器跳回这里
 * 区分会员/纹样订单；pending 时前端自动轮询到账
 */
export async function GET(req: NextRequest) {
  const outTradeNo = req.nextUrl.searchParams.get('out_trade_no') || '';

  let status: 'success' | 'pending' = 'pending';
  let title = '支付结果';
  let type: 'member' | 'pattern' = 'member';
  let backHref = '/member';
  let backText = '返回会员中心';

  if (outTradeNo) {
    const order = await getOrder(outTradeNo);
    if (order) {
      title = order.title;
      type = order.type;
      if (order.status === 'paid') status = 'success';
      if (order.backUrl) {
        backHref = order.backUrl;
        backText = '返回继续操作';
      } else if (type === 'member') {
        backHref = '/member';
        backText = '返回会员中心';
      } else {
        backHref = '/patterns/revival';
        backText = '返回纹样作品';
      }
    }
  }

  // pending 时嵌入轮询脚本，支付到账后自动刷新
  const pollScript = status === 'pending' && outTradeNo
    ? `<script>
      (function(){
        var outTradeNo = ${JSON.stringify(outTradeNo)};
        var tries = 0;
        var timer = setInterval(function(){
          tries++;
          fetch('/api/payment/status?out_trade_no=' + encodeURIComponent(outTradeNo))
            .then(function(r){ return r.json(); })
            .then(function(d){
              if (d && d.status === 'paid') {
                clearInterval(timer);
                try {
                  var pending = localStorage.getItem('hetu_pending_purchase');
                  if (pending) {
                    var item = JSON.parse(pending);
                    var list = JSON.parse(localStorage.getItem('hetu_purchases') || '[]');
                    var dup = list.some(function(p){ return p.id === item.id && p.tier === item.tier; });
                    if (!dup) list.push(item);
                    localStorage.setItem('hetu_purchases', JSON.stringify(list));
                    localStorage.removeItem('hetu_pending_purchase');
                  }
                } catch(e) {}
                location.reload();
              } else if (tries >= 30) {
                clearInterval(timer);
              }
            })
            .catch(function(){});
        }, 2000);
      })();
    </script>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${status === 'success' ? '支付成功' : '支付确认中'}</title>
<style>
  body { font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; background:#F5F3EE; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
  .card { background:#fff; border-radius:16px; padding:48px 40px; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,.06); max-width:420px; width:90%; }
  .icon { font-size:56px; }
  h1 { font-size:20px; color:#3A506B; margin:16px 0 8px; }
  p { color:#8a8a8a; font-size:14px; margin:0 0 24px; line-height:1.7; }
  .order { display:inline-block; background:#f5f3ee; border-radius:8px; padding:6px 14px; font-size:12px; color:#C3A370; margin-bottom:20px; }
  a { display:inline-block; background:#7BC4D0; color:#fff; text-decoration:none; padding:12px 32px; border-radius:8px; font-size:14px; }
  a:hover { background:#5fb3c0; }
  .hint { font-size:12px; color:#b0b0b0; margin-top:12px; }
</style>
</head>
<body>
<div class="card">
  <div class="icon">${status === 'success' ? '✅' : '⏳'}</div>
  <h1>${status === 'success' ? '支付成功' : '支付确认中'}</h1>
  <p>${status === 'success' ? `「${title}」已到账，感谢支持！` : `「${title}」正在确认到账，页面会自动刷新，请稍候…`}</p>
  ${outTradeNo ? `<div class="order">订单号 ${outTradeNo}</div>` : ''}
  <div><a href="${backHref}">${backText}</a></div>
  ${status === 'pending' ? '<div class="hint">如长时间未到账，请关闭本页后联系客服 studio@hetu-pattern.com</div>' : ''}
</div>
${pollScript}
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
