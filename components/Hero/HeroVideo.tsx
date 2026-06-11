'use client'
import Link from 'next/link'
import { useBranchSettings } from '@/lib/useBranchSettings'
import { useLocale, useTranslations } from 'next-intl'
import { siteConfig } from '@/site.config'

export default function HeroVideo() {
  const { seoTitleI18n, seoDescriptionI18n, seoTitle, seoDescription, loading } = useBranchSettings()
  const locale = useLocale()
  const t = useTranslations('hero')

  // Fallback: сначала локализованное, потом нелокализованное, потом из siteConfig, потом название ресторана
  const title = seoTitleI18n?.[locale] || seoTitle || siteConfig.seo?.title || siteConfig.clientName
  const description = seoDescriptionI18n?.[locale] || seoDescription || siteConfig.seo?.description || ''

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <video autoPlay muted loop playsInline poster={siteConfig.heroPosterUrl} className="absolute inset-0 w-full h-full object-cover">
        <source src={siteConfig.heroVideoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-lg lg:text-xl mb-10 opacity-90">{description}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.features.hasBooking && (
            <Link href={`/${locale}/reservations`} className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)' }}>
              {t('booking')}
            </Link>
          )}
          {siteConfig.features.hasMenu && (
            <Link href={`/${locale}/menu`} className="px-8 py-4 rounded-lg font-medium text-lg border-2 transition-colors hover:bg-white/10" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>
              {t('menu')}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}