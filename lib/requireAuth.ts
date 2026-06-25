import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

/**
 * 服务端组件中检查登录状态，未登录则跳转到 /login
 * 放在需要保护的 layout 或 page 第一行调用
 */
export async function requireAuth(returnPath?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token || !verifyToken(token)) {
    const loginUrl = returnPath ? `/login?redirect=${encodeURIComponent(returnPath)}` : '/login';
    redirect(loginUrl);
  }
}
