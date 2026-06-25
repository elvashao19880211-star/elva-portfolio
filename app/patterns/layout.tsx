import { requireAuth } from '@/lib/requireAuth';
import ClientRedirect from '@/components/ClientRedirect';

export default async function PatternsLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAuth('/patterns');

  if (!auth.loggedIn) {
    return <ClientRedirect to={auth.loginUrl} message="请先登录后访问纹样库" />;
  }

  return <>{children}</>;
}
