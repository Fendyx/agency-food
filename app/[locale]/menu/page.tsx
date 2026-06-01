import Menu from '@/components/Menu'
import { fetchMenu } from '@/lib/api'
import { siteConfig } from '@/site.config'
import type { MenuItem } from '@/types'

export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const items = await fetchMenu(siteConfig.tenantId).catch((): MenuItem[] => [])

  return <Menu items={items} />
}