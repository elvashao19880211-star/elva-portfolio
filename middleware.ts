import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 图片防盗链
 * - 外站 <img> 引用本站图片 → 403
 * - 本站页面引用 → 正常
 * - 无 Referer（直接打开图片、隐私模式、部分 App、搜索引擎抓取）→ 放行
 *
 * 只作用于 /images/ 路径，不影响页面与 API。
 */

const ALLOWED_HOSTS = [
  'hetu-pattern.com',
  'www.hetu-pattern.com',
  'localhost',
  '127.0.0.1',
];

export function middleware(request: NextRequest) {
  const referer = request.headers.get('referer');

  // 无 Referer：直接访问图片 / 浏览器隐私模式 / App 内打开 → 放行
  if (!referer) return NextResponse.next();

  try {
    const host = new URL(referer).hostname.toLowerCase();

    const isAllowed =
      ALLOWED_HOSTS.includes(host) ||
      host.endsWith('.vercel.app'); // Vercel 预览部署

    if (isAllowed) return NextResponse.next();
  } catch {
    // Referer 格式异常，保守放行，避免误伤
    return NextResponse.next();
  }

  // 外站引用：拒绝
  return new NextResponse('Hotlink blocked · 图片版权归河图纹画所有', {
    status: 403,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}

export const config = {
  matcher: '/images/:path*',
};
