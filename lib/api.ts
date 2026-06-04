export async function fetchMenu(tenantId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/saas/menu?tenantId=${tenantId}`,
    { cache: 'no-store' }
  )
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  if (!res.ok) throw new Error('Failed to fetch menu')
  return res.json()
}

export async function fetchGallery(tenantId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/saas/gallery?tenantId=${tenantId}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error('Failed to fetch gallery')
  return res.json()
}