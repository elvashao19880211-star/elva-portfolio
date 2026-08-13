import crypto from 'crypto';

// ============================================================
// 支付宝 RSA2 签名工具（电脑网站支付 alipay.trade.page.pay）
// 不依赖第三方 SDK，用 Node 内置 crypto 实现
// ============================================================

export const ALIPAY_GATEWAY = 'https://openapi.alipay.com/gateway.do';

function normalizePrivateKey(key: string): string {
  const k = key.trim();
  if (k.includes('-----BEGIN')) return k;
  // 裸 base64 → 包装成 PKCS8 PEM
  return `-----BEGIN PRIVATE KEY-----\n${k.replace(/\s+/g, '')}\n-----END PRIVATE KEY-----`;
}

function normalizePublicKey(key: string): string {
  const k = key.trim();
  if (k.includes('-----BEGIN')) return k;
  return `-----BEGIN PUBLIC KEY-----\n${k.replace(/\s+/g, '')}\n-----END PUBLIC KEY-----`;
}

/**
 * 生成签名字符串：按 key ASCII 升序，拼接 key=value，空值跳过，& 连接
 */
function buildSignString(params: Record<string, string>): string {
  return Object.keys(params)
    .filter((k) => params[k] !== '' && params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
}

/**
 * RSA2（SHA256withRSA）签名
 */
export function sign(params: Record<string, string>, privateKey: string): string {
  const signStr = buildSignString(params);
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signStr, 'utf8');
  return signer.sign(normalizePrivateKey(privateKey), 'base64');
}

/**
 * RSA2 验签（用于异步通知）
 */
export function verify(
  params: Record<string, string>,
  signValue: string,
  publicKey: string
): boolean {
  const filtered: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (k === 'sign' || k === 'sign_type') continue;
    if (v === '' || v === undefined || v === null) continue;
    filtered[k] = v;
  }
  const signStr = buildSignString(filtered);
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(signStr, 'utf8');
  return verifier.verify(normalizePublicKey(publicKey), signValue, 'base64');
}

/**
 * 支付宝时间戳：yyyy-MM-dd HH:mm:ss（北京时间）
 */
export function alipayTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const d = new Date(date.getTime() + 8 * 3600 * 1000);
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

/**
 * 生成电脑网站支付表单 HTML（自动 POST 跳转支付宝）
 */
export function buildPagePayForm(params: {
  appId: string;
  privateKey: string;
  outTradeNo: string;
  totalAmount: string; // 元，两位小数
  subject: string;
  notifyUrl: string;
  returnUrl: string;
}): string {
  const bizContent = JSON.stringify({
    out_trade_no: params.outTradeNo,
    total_amount: params.totalAmount,
    subject: params.subject,
    product_code: 'FAST_INSTANT_TRADE_PAY',
  });

  const common: Record<string, string> = {
    app_id: params.appId,
    method: 'alipay.trade.page.pay',
    format: 'JSON',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: alipayTimestamp(),
    version: '1.0',
    notify_url: params.notifyUrl,
    return_url: params.returnUrl,
    biz_content: bizContent,
  };

  const signValue = sign(common, params.privateKey);

  // 构造 HTML 表单（biz_content 需 URL 编码）
  const inputs = Object.keys(common)
    .map((k) => {
      const val = k === 'biz_content' ? encodeURIComponent(common[k]) : common[k];
      return `<input type="hidden" name="${k}" value="${escapeHtml(val)}" />`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>跳转支付宝支付...</title>
</head>
<body onload="document.forms[0].submit()">
<form action="${ALIPAY_GATEWAY}" method="POST" accept-charset="utf-8">
${inputs}
<input type="hidden" name="sign" value="${signValue}" />
</form>
<p style="text-align:center;font-family:sans-serif;margin-top:60px;color:#666;">正在跳转到支付宝，请稍候…</p>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * 校验支付宝异步通知参数（业务参数 + 验签）
 */
export function verifyNotify(
  params: Record<string, string>,
  publicKey: string,
  expectedAppId?: string
): { valid: boolean; reason?: string } {
  const sign = params.sign;
  if (!sign) return { valid: false, reason: '缺少 sign' };
  if (params.sign_type !== 'RSA2') return { valid: false, reason: `不支持的签名算法: ${params.sign_type}` };

  if (!verify(params, sign, publicKey)) {
    return { valid: false, reason: '验签失败' };
  }
  if (params.trade_status !== 'TRADE_SUCCESS' && params.trade_status !== 'TRADE_FINISHED') {
    return { valid: false, reason: `交易状态非成功: ${params.trade_status}` };
  }
  if (expectedAppId && params.app_id !== expectedAppId) {
    return { valid: false, reason: 'app_id 不匹配' };
  }
  return { valid: true };
}
