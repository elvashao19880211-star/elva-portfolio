import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

/**
 * 服务端检查登录状态，返回 { loggedIn, loginUrl }
 * 不调用 redirect()，由调用方渲染 ClientRedirect 组件
 * 避免 307 重定向在部分浏览器中出现 ERR_FAILED
 */
export async function requireAuth(returnPath?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token || !verifyToken(token)) {
    return {
      loggedIn: false as const,
      loginUrl: returnPath
        ? `/login?redirect=${encodeURIComponent(returnPath)}`
        : '/login',
    };
  }

  return { loggedIn: true as const, loginUrl: '' };
}
