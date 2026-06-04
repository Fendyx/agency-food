'use client'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/site.config'
import { useTranslations } from 'next-intl'

type NewsType = 'info' | 'marketing' | 'alert'

interface NewsPost {
  _id: string
  type: NewsType
  title: string
  content: string
  createdAt: string
  expiresAt?: string | null
}

const TYPE_CONFIG: Record<NewsType, {
  stripe: string
  badge: string
  label: string
  expires: string
}> = {
  info: {
    stripe: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    label: 'Info',
    expires: 'text-text-tertiary',
  },
  marketing: {
    stripe: 'bg-green-500',
    badge: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    label: 'Update',
    expires: 'text-text-tertiary',
  },
  alert: {
    stripe: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    label: 'Alert',
    expires: 'text-red-400',
  },
}

export default function GopublicaPage() {
  const t = useTranslations('admin.gopublicaPage')
  const [news, setNews] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('saas_token')
    if (!savedToken) {
      window.location.href = '/admin/login'
    } else {
      setToken(savedToken)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/saas/news?tenantId=${siteConfig.tenantId}&tariff=basic`
    )
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-1.5 py-12">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-border animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-6">
        {t('title')}
      </h2>

      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-16 border-2 border-dashed border-border rounded-xl text-center">
          <p className="text-sm font-medium text-text-secondary">{t('empty')}</p>
          <p className="text-xs text-text-tertiary">{t('emptyDesc')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {news.map((item) => {
            const cfg = TYPE_CONFIG[item.type]
            return (
              <article
                key={item._id}
                className="grid grid-cols-[3px_1fr] rounded-xl border border-border-light bg-surface-card shadow-card overflow-hidden transition-shadow hover:shadow-dropdown"
              >
                {/* Accent stripe */}
                <div className={`${cfg.stripe} self-stretch`} aria-hidden />

                {/* Body */}
                <div className="px-5 py-4">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className={`inline-flex items-center text-[11px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <h3 className="flex-1 min-w-0 text-sm font-semibold text-text-primary leading-snug truncate">
                      {item.title}
                    </h3>
                    <time className="shrink-0 text-xs text-text-tertiary ml-auto">
                      {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>

                  {/* Content */}
                  <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">
                    {item.content}
                  </p>

                  {/* Expires */}
                  {item.expiresAt && (
                    <p className={`mt-3 pt-3 border-t border-border-light text-xs ${cfg.expires}`}>
                      {t('expires')}{' '}
                      {new Date(item.expiresAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}