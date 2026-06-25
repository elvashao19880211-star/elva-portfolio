import { requireAuth } from '@/lib/requireAuth';

export default async function MaterialsLayout({ children }: { children: React.ReactNode }) {
  await requireAuth('/materials');
  return <>{children}</>;
}
