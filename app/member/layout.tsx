import { requireAuth } from '@/lib/requireAuth';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return <>{children}</>;
}
