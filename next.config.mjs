/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: ['192.168.0.106', 'localhost'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 防点击劫持：禁止被外部站点用 iframe 嵌入
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // 防 MIME 类型嗅探
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // 控制跨站引用来源信息
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // 关闭用不到的浏览器能力
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // 纹样图片一律禁止搜索引擎索引（页面仍正常收录）
        source: '/images/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noimageindex' }],
      },
    ];
  },
};

export default nextConfig;
