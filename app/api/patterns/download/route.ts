import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/userStore';
import { getPaidPatternsByEmail } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 生成 OSS 签名临时下载链接（V1 签名，HMAC-SHA1）
 * 仅允许 revival/innovation 两个前缀
 */
function signOssUrl(objectKey: string, expiresSeconds = 600): string {
  const akId = process.env.OSS_AK_ID!;
  const akSecret = process.env.OSS_AK_SECRET!;
  const bucket = process.env.OSS_BUCKET!;
  const region = process.env.OSS_REGION || 'oss-cn-beijing';

  const expires = Math.floor(Date.now() / 1000) + expiresSeconds;
  const canonicalizedResource = `/${bucket}/${objectKey}`;
  const stringToSign = `GET\n\n\n${expires}\n${canonicalizedResource}`;
  const signature = crypto
    .createHmac('sha1', akSecret)
    .update(stringToSign)
    .digest('base64');

  const host = `${bucket}.${region}.aliyuncs.com`;
  const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/');
  return `https://${host}/${encodedKey}?OSSAccessKeyId=${akId}&Expires=${expires}&Signature=${encodeURIComponent(signature)}`;
}

/**
 * 已购纹样下载无水印原图
 * GET /api/patterns/download?name=revival/xxx.png
 * 校验：登录 + 该邮箱已购此纹样 → 返回签名临时链接
 */
export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get('name') || '';

    // 1. 白名单校验
    if (!/^(revival|innovation)\/[^/]+\.(png|jpe?g|webp)$/i.test(name)) {
      return NextResponse.json({ error: '参数不合法' }, { status: 400 });
    }

    // 2. 校验登录态
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录', code: 'NO_LOGIN' }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: '登录已过期，请重新登录', code: 'NO_LOGIN' }, { status: 401 });
    }
    const user = await getUserById(payload.id);
    if (!user) {
      return NextResponse.json({ error: '用户不存在', code: 'NO_LOGIN' }, { status: 401 });
    }

    // 3. 校验已购（该邮箱下的已支付订单里是否含此纹样文件）
    const email = user.email;
    if (!email) {
      return NextResponse.json(
        { error: '账号未绑定邮箱，无法校验购买记录', code: 'NOT_OWNED' },
        { status: 403 }
      );
    }
    const filename = name.split('/').pop() || '';
    const owned = await getPaidPatternsByEmail(email);
    const isOwned = owned.some((o) => {
      const src = o.src || '';
      return src.includes(filename) || src.includes(name);
    });
    if (!isOwned) {
      return NextResponse.json(
        { error: '尚未购买该纹样，请先购买授权', code: 'NOT_OWNED' },
        { status: 403 }
      );
    }

    // 4. 生成签名临时链接（10 分钟有效）
    const url = signOssUrl(name);
    return NextResponse.json({ url });
  } catch (e: any) {
    console.error('patterns download error:', e?.message || e);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
