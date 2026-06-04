'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { siteConfig } from '@/site.config'
import { useTenantSettings } from '@/lib/useTenantSettings'

export default function Footer() {
  const t = useTranslations('footer')
  const { settings } = useTenantSettings(siteConfig.tenantId)
  const locale = useLocale()

  const currentYear = new Date().getFullYear()

  // Навигационные ссылки с учётом локали
  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/menu`, label: t('menu') },
    { href: `/${locale}/reservations`, label: t('reservations') },
    { href: '#contact', label: t('contact') },
  ]

  // Правовые ссылки (пока placeholder — позже можно заменить на реальные страницы)
const legalLinks = [
  { href: '#', label: t('privacyPolicy') },
  { href: '#', label: t('terms') },
];

  return (
    <footer className="bg-surface-inverse text-text-inverse/80 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Верхняя часть — сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-text-inverse/20">
          {/* Бренд и контакты */}
          <div className="lg:col-span-2">
            <p className="font-heading text-2xl font-semibold text-text-inverse mb-3">
              {siteConfig.clientName}
            </p>
            {settings.address && (
              <p className="text-sm">{settings.address}</p>
            )}
            {settings.phone && (
              <p className="text-sm">
                <a href={`tel:${settings.phone}`} className="hover:text-text-inverse transition-colors">
                  {settings.phone}
                </a>
              </p>
            )}
            {settings.email && (
              <p className="text-sm">
                <a href={`mailto:${settings.email}`} className="hover:text-text-inverse transition-colors">
                  {settings.email}
                </a>
              </p>
            )}
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-semibold text-text-inverse mb-3 text-sm uppercase tracking-wider">
              {t('navigation')}
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-text-inverse transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Документы */}
          <div>
            <h4 className="font-semibold text-text-inverse mb-3 text-sm uppercase tracking-wider">
              {t('legal')}
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm hover:text-text-inverse transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 text-sm">
          <p>© {currentYear} {siteConfig.clientName}</p>
          <p className="flex items-center gap-1">
            <span>{t('poweredBy')}</span>
            <a
              href="https://gopublica.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-text-inverse hover:underline"
            >
              GoPublica
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}