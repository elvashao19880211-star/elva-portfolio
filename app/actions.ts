'use server';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/userStore';

export interface SessionUser {
  id: string;
  phone?: string;
  email?: string;
  nickname: string;
  createdAt?: string;
}

export async function getSession(): Promise<{ user: SessionUser | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return { user: null };

    const payload = verifyToken(token);
    if (!payload) return { user: null };

    const user = await getUserById(payload.id);
    return { user: user as SessionUser | null };
  } catch {
    return { user: null };
  }
}
