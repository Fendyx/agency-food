'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { siteConfig } from '@/site.config'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { Menu, X, CalendarDays } from 'lucide-react'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  // Закрытие меню при клике на свободное место
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Закрытие меню по стрелке "назад" браузера
  useEffect(() => {
    if (!isOpen) return

    window.history.pushState({ menuOpen: true }, '')

    const handlePopState = () => {
      setIsOpen(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      // Намеренно НЕ вызываем history.back() здесь —
      // иначе при клике на любую ссылку навигация отменялась бы.
      // Фейковый pushState просто остаётся в истории, это безопасно.
    }
  }, [isOpen])

  const links = [
    { href: `/${locale}`, label: t('home') },
    ...(siteConfig.features.hasMenu ? [{ href: `/${locale}/menu`, label: t('menu') }] : []),
    ...(siteConfig.features.hasGallery ? [{ href: '#gallery', label: t('gallery') }] : []),
    { href: '#contact', label: t('contact') },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-page border-b border-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Логотип */}
          <Link
            href={`/${locale}`}
            className="font-heading text-xl font-semibold text-text-primary hover:text-primary transition-colors"
          >
            {siteConfig.clientName}
          </Link>

          {/* Десктоп навигация */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA кнопка + переключатели + мобильный бургер */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            
            {siteConfig.features.hasBooking && (
              <Link
                href={`/${locale}/reservations`}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <CalendarDays size={14} />
                {t('booking')}
              </Link>
            )}

            {/* Бургер */}
            <button
              ref={burgerRef}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
              aria-label="Открыть меню"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isOpen && (
        <div ref={menuRef} className="md:hidden border-t border-border-light bg-surface-page px-4 py-4 flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm text-text-secondary hover:text-primary transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3 mt-2">
            {siteConfig.features.hasBooking && (
              <Link
                href={`/${locale}/reservations`}
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {t('booking')}
              </Link>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}