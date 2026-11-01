import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.hetu-pattern.com';

/**
 * robots.txt
 * - 页面默认允许抓取（保证「河图纹画」等品牌词能被搜到）
 * - 禁止抓取 /images/ 目录（纹样图片不被收录）
 * - 禁止抓取接口与账户页
 *
 * 注意：不使用 Allow: / 显式声明，避免与 Disallow 产生优先级歧义
 * （不同搜索引擎对 Allow/Disallow 冲突的处理不一致，去掉 Allow 更安全）
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/api/', '/account', '/member', '/images/'],
      },
      {
        userAgent: 'Baiduspider',
        disallow: ['/api/', '/account', '/member', '/images/'],
      },
      {
        userAgent: 'Baiduspider-image',
        disallow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        disallow: '/',
      },
      {
        userAgent: 'Bingbot',
        disallow: ['/api/', '/account', '/member', '/images/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
