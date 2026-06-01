'use client'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/site.config'

type NewsType = 'info' | 'marketing' | 'alert'

interface NewsPost {
  _id: string
  type: NewsType
  title: string
  content: string
  createdAt: string
  expiresAt?: string | null
}

const TYPE_ICONS: Record<NewsType, string> = {
  info: 'ℹ️',
  marketing: '📈',
  alert: '⚠️',
}

const TYPE_COLORS: Record<NewsType, string> = {
  info: 'border-blue-500 bg-blue-50',
  marketing: 'border-green-500 bg-green-50',
  alert: 'border-red-500 bg-red-50',
}

export default function GopublicaPage() {
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

    // tariff пока заглушка — позже можно брать из подписки или настроек
    const tariff = 'basic'

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/saas/news?tenantId=${siteConfig.tenantId}&tariff=${tariff}`
    )
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return <div className="text-center py-10 text-text-secondary">Загрузка новостей...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Новости от Gopublica</h2>

      {news.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
          <p className="text-text-secondary">Пока нет новостей</p>
          <p className="text-sm text-text-tertiary mt-1">
            Здесь будут появляться новости и уведомления от вашего сервис-провайдера.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <article
              key={item._id}
              className={`border-l-4 rounded-r-lg p-5 ${TYPE_COLORS[item.type]} bg-white shadow-card`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{TYPE_ICONS[item.type]}</span>
                <h3 className="font-bold text-text-primary">{item.title}</h3>
                <span className="text-xs text-text-tertiary ml-auto">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-text-secondary text-sm whitespace-pre-line">{item.content}</p>
              {item.expiresAt && (
                <p className="text-xs text-text-tertiary mt-2">
                  Действует до: {new Date(item.expiresAt).toLocaleDateString()}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}