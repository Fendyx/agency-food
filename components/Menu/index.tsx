import { siteConfig } from '@/site.config'
import type { MenuItem } from '@/types'
import MenuLayout from './MenuLayout'

export default function Menu({ items }: { items: MenuItem[] }) {
  if (!siteConfig.features.hasMenu || !items.length) return null

  return (
    <section id="menu" className="py-16 bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MenuLayout items={items} menuStyle={siteConfig.menuStyle || 'grid'} />
      </div>
    </section>
  )
}