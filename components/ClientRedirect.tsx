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
    router.replace(to);
  }, [to, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm animate-pulse">{message}</p>
    </main>
  );
}
