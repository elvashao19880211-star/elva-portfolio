import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.hetu-pattern.com';

/**
 * robots.txt —— 允许搜索引擎抓取页面与图片，禁止抓取接口和账户页
 * 访问地址：/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account', '/member'],
      },
      // 百度蜘蛛单独声明（明确允许，加快收录）
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: ['/api/', '/account', '/member'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
