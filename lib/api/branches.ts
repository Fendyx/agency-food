import { Branch } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchBranches(tenantId: string): Promise<Branch[]> {
  const res = await fetch(`${API_URL}/api/saas/branches`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch branches');
  return res.json();
}

// Для публичных страниц (без токена) – только если бэкенд разрешит
// Пока оставим только для авторизованных, но для публики можно сделать отдельный endpoint