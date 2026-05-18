/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: ['192.168.0.106', 'localhost'],
};

export default nextConfig;
