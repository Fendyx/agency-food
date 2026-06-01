'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { siteConfig } from '@/site.config'
import { useTenantSettings } from '@/lib/useTenantSettings'

export default function Footer() {
  const t = useTranslations('footer')
  const { settings } = useTenantSettings(siteConfig.tenantId)

  return (
    <footer className="bg-surface-inverse text-text-inverse/70 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          <p className="font-heading text-text-inverse text-lg">{siteConfig.clientName}</p>
          <p>{settings.address}</p>
          <p>{settings.phone}</p>
        </div>
        <div className="text-sm text-right">
          <p>© {new Date().getFullYear()} {siteConfig.clientName}</p>
          <Link href="/admin/login" className="hover:text-text-inverse">
            {t('admin')}
          </Link>
        </div>
      </div>
    </footer>
  )
}