'use client'
import { useLocale } from 'next-intl' // не используем, но для ясности
import { routing } from '@/src/i18n/routing'

interface Props {
  currentLocale: string
  onChange: (locale: string) => void
}

export default function AdminLanguageSwitcher({ currentLocale, onChange }: Props) {
  return (
    <div className="flex gap-1 p-2">
      {routing.locales.map(locale => (
        <button
          key={locale}
          onClick={() => onChange(locale)}
          className={`px-2 py-1 text-xs rounded ${
            locale === currentLocale
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-surface-hover'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}