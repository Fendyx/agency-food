'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/site.config'
import { UtensilsCrossed, CalendarCheck, ClipboardList, ArrowRight, Settings, ImageIcon } from 'lucide-react'

type DashboardData = {
  menuCount: number
  todayReservationsCount: number
  totalReservationsCount: number
  lastReservations: Array<{
    _id: string
    name: string
    phone: string
    date: string
    time: string
    guests: number
    status: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('saas_token')
    if (!savedToken) {
      router.push('/admin/login')
    } else {
      setToken(savedToken)
    }
  }, [])

  useEffect(() => {
    if (!token) return

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div className="text-center py-10">Загрузка дашборда...</div>

  const stats = [
    { label: 'Блюд в меню', value: data?.menuCount ?? 0, icon: UtensilsCrossed },
    { label: 'Броней сегодня', value: data?.todayReservationsCount ?? 0, icon: CalendarCheck },
    { label: 'Всего бронирований', value: data?.totalReservationsCount ?? 0, icon: ClipboardList },
  ]

  const quickLinks = [
    { label: 'Управлять меню', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Бронирования', href: '/admin/reservations', icon: CalendarCheck },
    { label: 'Галерея', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Настройки', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Добро пожаловать, {siteConfig.clientName}!</h1>
        <p className="text-text-secondary">Краткая сводка по вашему сайту.</p>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-6 rounded-lg shadow border border-zinc-200">
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-primary" />
              <p className="text-sm text-zinc-500">{label}</p>
            </div>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Быстрые ссылки */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Быстрые действия</h2>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Последние бронирования */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Сегодняшние бронирования</h2>
        {data?.lastReservations && data.lastReservations.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="p-3">Имя</th>
                  <th className="p-3">Время</th>
                  <th className="p-3">Гостей</th>
                  <th className="p-3">Телефон</th>
                  <th className="p-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {data.lastReservations.map(r => (
                  <tr key={r._id} className="border-t">
                    <td className="p-3">{r.name}</td>
                    <td className="p-3">{r.time}</td>
                    <td className="p-3">{r.guests}</td>
                    <td className="p-3">{r.phone}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        r.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        r.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {r.status === 'pending' ? 'Новый' : r.status === 'confirmed' ? 'Подтверждён' : 'Отклонён'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-zinc-500">На сегодня бронирований нет.</p>
        )}
      </div>
    </div>
  )
}