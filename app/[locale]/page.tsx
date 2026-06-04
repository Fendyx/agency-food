import Hero from '@/components/Hero'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Gallery from '@/components/sections/Gallery'
import Menu from '@/components/Menu'
import BookingSection from '@/components/sections/BookingSection'   // <-- новый импорт
import { siteConfig } from '@/site.config'
import StickyCallBtn from '@/components/ui/StickyCallBtn'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { fetchMenu, fetchGallery } from '@/lib/api'
import type { MenuItem } from '@/types'
import type { GalleryItem } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [menuItems, galleryImages] = await Promise.all([
    siteConfig.features.hasMenu
      ? fetchMenu(siteConfig.tenantId).catch((): MenuItem[] => [])
      : ([] as MenuItem[]),
    siteConfig.features.hasGallery
      ? fetchGallery(siteConfig.tenantId).catch((): GalleryItem[] => [])
      : ([] as GalleryItem[]),
  ])

  return (
    <>
      <Hero />

      <AnimatedSection><About /></AnimatedSection>

      <AnimatedSection><Menu items={menuItems} /></AnimatedSection>

      {/* Форма бронирования */}
      <AnimatedSection><BookingSection /></AnimatedSection>

      <AnimatedSection><Gallery images={galleryImages} /></AnimatedSection>

      <AnimatedSection><Contact /></AnimatedSection>

      <StickyCallBtn phone={siteConfig.contact.phone} />
    </>
  )
}