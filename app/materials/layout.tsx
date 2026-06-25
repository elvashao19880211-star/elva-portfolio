import { requireAuth } from '@/lib/requireAuth';
import ClientRedirect from '@/components/ClientRedirect';

export default async function MaterialsLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAuth('/materials');

  if (!auth.loggedIn) {
    return <ClientRedirect to={auth.loginUrl} message="请先登录后访问素材库" />;
  }

  return <>{children}</>;
}
