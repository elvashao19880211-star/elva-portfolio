import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 图片防盗链（v2 — 宽松模式）
 * - 无 Referer（直接打开、App 内打开、隐私模式、搜索引擎）→ 放行
 * - Referer 包含本站域名（任意协议/子域）→ 放行
 * - 其他外站 → 403，且 **不缓存**（避免 403 被 CDN/浏览器缓存导致图片长期不显示）
 *
 * 只作用于 /images/ 路径，不影响页面与 API。
 */

const ALLOWED_PATTERNS = [
  'hetu-pattern.com',
  'vercel.app',
  'localhost',
  '127.0.0.1',
];

export function middleware(request: NextRequest) {
  const referer = request.headers.get('referer');

  // 无 Referer：直接访问 / 浏览器隐私模式 / App 内打开 / 搜索引擎抓取 → 放行
  if (!referer) return NextResponse.next();

  const lower = referer.toLowerCase();
  const isAllowed = ALLOWED_PATTERNS.some((p) => lower.includes(p));

  if (isAllowed) return NextResponse.next();

  // 外站引用：拒绝，且明确不缓存（关键！）
  return new NextResponse('Hotlink blocked', {
    status: 403,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
      'cdn-cache-control': 'no-store',
      'vercel-cdn-cache-control': 'no-store',
    },
  });
}

export const config = {
  matcher: '/images/:path*',
};
