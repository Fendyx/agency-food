'use client'
import { useTranslations } from 'next-intl'
import { useTenantSettings } from '@/lib/useTenantSettings'
import { siteConfig } from '@/site.config'

export default function About() {
  const t = useTranslations('about')
  const { settings } = useTenantSettings(siteConfig.tenantId)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">{t('title')}</h2>
        <p className="text-center text-zinc-600 max-w-2xl mx-auto">
          {settings.seoDescription}
        </p>
      </div>
    </section>
  )
}