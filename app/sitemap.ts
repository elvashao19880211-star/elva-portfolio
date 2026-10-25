import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.hetu-pattern.com';

/**
 * 站点地图 —— 告诉百度/Google 有哪些页面可以抓取
 * 访问地址：/sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: Array<{ path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/patterns', priority: 0.9, freq: 'weekly' },
    { path: '/patterns/revival', priority: 0.9, freq: 'weekly' },
    { path: '/patterns/innovation', priority: 0.9, freq: 'weekly' },
    { path: '/materials', priority: 0.8, freq: 'weekly' },
    { path: '/cooperation', priority: 0.8, freq: 'monthly' },
    { path: '/community', priority: 0.7, freq: 'weekly' },
    { path: '/heritage', priority: 0.7, freq: 'monthly' },
    { path: '/join', priority: 0.6, freq: 'monthly' },
    { path: '/member', priority: 0.6, freq: 'monthly' },
    { path: '/login', priority: 0.3, freq: 'monthly' },
    { path: '/copyright', priority: 0.3, freq: 'monthly' },
    { path: '/privacy', priority: 0.2, freq: 'monthly' },
    { path: '/refund', priority: 0.2, freq: 'monthly' },
    { path: '/terms', priority: 0.2, freq: 'monthly' },
  ];

  return pages.map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
