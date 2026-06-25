import { requireAuth } from '@/lib/requireAuth';
import ClientRedirect from '@/components/ClientRedirect';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAuth('/member');

  if (!auth.loggedIn) {
    return <ClientRedirect to={auth.loginUrl} message="请先登录后访问会员中心" />;
  }

  return <>{children}</>;
}
