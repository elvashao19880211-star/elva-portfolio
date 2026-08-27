'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({
  to,
  message = '正在跳转...',
}: {
  to: string;
  message?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    // 用客户端 window.location 带上完整当前路径（含 query），
    // 登录后能跳回原处（如 /patterns/revival?id=revival-6）
    const fullPath = window.location.pathname + window.location.search;
    const base = to.split('?')[0] || '/login';
    router.replace(`${base}?redirect=${encodeURIComponent(fullPath)}`);
  }, [to, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm animate-pulse">{message}</p>
    </main>
  );
}
