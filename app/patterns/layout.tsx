import { requireAuth } from '@/lib/requireAuth';

export default async function PatternsLayout({ children }: { children: React.ReactNode }) {
  await requireAuth('/patterns');
  return <>{children}</>;
}
