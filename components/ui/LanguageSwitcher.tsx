'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/src/i18n/routing'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()

  const switchLanguage = (newLocale: string) => {
    // Заменяем первый сегмент URL (текущую локаль) на новую
    const segments = pathname.split('/').filter(Boolean) // убираем пустые
    segments[0] = newLocale
    const newPath = '/' + segments.join('/')
    router.push(newPath)
  }

  return (
    <div className="flex gap-1">
      {routing.locales.map(locale => (
        <button
          key={locale}
          onClick={() => switchLanguage(locale)}
          className={`px-2 py-1 text-xs rounded ${
            locale === currentLocale
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-surface-hover'
          }`}
          aria-label={`Switch to ${locale}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}