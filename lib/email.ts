/**
 * 阿里云邮件推送 (DirectMail)
 * 需环境变量: ALI_ACCESS_KEY_ID, ALI_ACCESS_KEY_SECRET, ALI_DM_ACCOUNT
 */

import crypto from 'crypto';

// 阿里云签名 V1（HMAC-SHA1）
function sha1Hmac(key: string, str: string): string {
  return crypto.createHmac('sha1', key).update(str, 'utf8').digest('base64');
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/\+/g, '%20');
}

function sign(params: Record<string, string>, accessKeySecret: string): string {
  const sorted = Object.keys(params).sort();
  const query = sorted.map(k => `${percentEncode(k)}=${percentEncode(params[k])}`).join('&');
  const strToSign = `GET&${percentEncode('/')}&${percentEncode(query)}`;
  return sha1Hmac(accessKeySecret + '&', strToSign);
}

export async function sendVerificationCode(
  to: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const keyId = process.env.ALI_ACCESS_KEY_ID?.trim();
  const keySecret = process.env.ALI_ACCESS_KEY_SECRET?.trim();
  const account = process.env.ALI_DM_ACCOUNT?.trim(); // 发件地址，如 noreply@hetu-pattern.com
  console.log('[DirectMail] env check:', { hasKeyId: !!keyId, hasSecret: !!keySecret, account });

  if (!keyId || !keySecret || !account) {
    // 本地开发 - 控制台输出验证码，线上返回错误
    console.log(`\n📧 [DEV] 验证码: ${code} → ${to}\n`);
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: '邮件服务未配置，请联系管理员' };
    }
    return { success: true };
  }

  const params: Record<string, string> = {
    AccessKeyId: keyId,
    Action: 'SingleSendMail',
    AccountName: account,
    ReplyToAddress: 'false',
    AddressType: '1',
    ToAddress: to,
    Subject: '验证码 - 河图·华夏纹样传承',
    HtmlBody: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
      <div style="text-align:center;margin-bottom:24px"><span style="font-size:32px">🏮</span></div>
      <h2 style="color:#3A506B;text-align:center;margin-bottom:8px">验证你的邮箱</h2>
      <p style="color:#666;text-align:center;font-size:14px;margin-bottom:24px">你正在注册河图·华夏纹样传承账号</p>
      <div style="background:#f7f8fa;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
        <span style="font-size:12px;color:#999;display:block;margin-bottom:8px">验证码</span>
        <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#3A506B;font-family:monospace">${code}</span>
      </div>
      <p style="text-align:center;font-size:12px;color:#aaa">验证码 10 分钟内有效 · 如非本人操作请忽略</p>
    </div>`,
    Format: 'JSON',
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    Timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    Version: '2015-11-23',
  };

  params.Signature = sign(params, keySecret);

  const queryString = Object.keys(params).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

  try {
    const res = await fetch(`https://dm.aliyuncs.com/?${queryString}`);
    const data = await res.json();

    if (data.Code) {
      console.error('阿里云邮件发送失败:', data);
      return { success: false, error: data.Message || '发送失败' };
    }

    return { success: true };
  } catch (err) {
    console.error('阿里云 API 异常:', err);
    return { success: false, error: '邮件服务异常' };
  }
}
