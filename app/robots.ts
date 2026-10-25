import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.hetu-pattern.com';

/**
 * robots.txt
 * - 允许搜索引擎抓取页面（保证「河图纹画」等品牌词能被搜到）
 * - 禁止抓取 /images/ 目录（纹样图片不被收录，防止被搜索/截图传播）
 * - 禁止抓取接口与账户页
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account', '/member', '/images/'],
      },
      // 百度蜘蛛单独声明
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: ['/api/', '/account', '/member', '/images/'],
      },
      // 图片搜索专用蜘蛛：一律拒绝
      {
        userAgent: 'Baiduspider-image',
        disallow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
