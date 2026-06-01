'use client'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/site.config'

export default function SettingsPage() {
  const [token, setToken] = useState<string | null>(null)
  const [form, setForm] = useState({
    phone: '',
    address: '',
    email: '',
    hours: '',
    googleMapsUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [primaryLanguage, setPrimaryLanguage] = useState('pl')

  // Состояние для уведомлений
  const [notifications, setNotifications] = useState({
    booking: {
      sound: true,
      message: true,
      soundFile: '',
    },
  })

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
    // Загружаем текущие настройки
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/settings?tenantId=${siteConfig.tenantId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          phone: data.phone || siteConfig.contact.phone,
          address: data.address || siteConfig.contact.address,
          email: data.email || siteConfig.contact.email,
          hours: data.hours || siteConfig.contact.hours,
          googleMapsUrl: data.googleMapsUrl || siteConfig.contact.googleMapsUrl || '',
        })
        if (data.primaryLanguage) setPrimaryLanguage(data.primaryLanguage)
        if (data.notifications) {
          setNotifications(prev => ({
            ...prev,
            ...data.notifications,
            booking: { ...prev.booking, ...(data.notifications.booking || {}) },
          }))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        notifications,
        primaryLanguage,
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-center py-10">Загрузка...</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Настройки</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Телефон</label>
          <input
            type="text"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Адрес</label>
          <input
            type="text"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Часы работы</label>
          <input
            type="text"
            value={form.hours}
            onChange={e => setForm({ ...form, hours: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Google Maps URL</label>
          <input
            type="text"
            value={form.googleMapsUrl}
            onChange={e => setForm({ ...form, googleMapsUrl: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Секция уведомлений */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Уведомления о бронировании</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifications.booking.sound}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    booking: { ...notifications.booking, sound: e.target.checked },
                  })
                }
              />
              <span>Звуковое оповещение</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifications.booking.message}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    booking: { ...notifications.booking, message: e.target.checked },
                  })
                }
              />
              <span>Всплывающее сообщение</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Мелодия</label>
              <select
                value={notifications.booking.soundFile}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    booking: { ...notifications.booking, soundFile: e.target.value },
                  })
                }
                className="border p-2 rounded mt-1 w-full max-w-xs"
              >
                <option value="">Стандартный (default)</option>
                <option value="/sounds/1.mp3">Мелодия 1</option>
                <option value="custom">Свой URL</option>
              </select>
              {notifications.booking.soundFile === 'custom' && (
                <input
                  type="text"
                  placeholder="Введите URL звукового файла"
                  value={
                    notifications.booking.soundFile === 'custom'
                      ? ''
                      : notifications.booking.soundFile
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      booking: { ...notifications.booking, soundFile: e.target.value },
                    })
                  }
                  className="border p-2 rounded mt-1 w-full"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  const src =
                    notifications.booking.soundFile && notifications.booking.soundFile !== 'custom'
                      ? notifications.booking.soundFile
                      : '/sounds/default.mp3';
                  new Audio(src).play();
                }}
                className="ml-2 text-sm text-blue-600 hover:underline"
              >
                Прослушать
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Сохранить
          </button>
          {saved && <span className="text-green-600 text-sm">Сохранено!</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Основной язык ресторана</label>
          <select
            value={primaryLanguage}
            onChange={(e) => setPrimaryLanguage(e.target.value)}
            className="border p-2 rounded mt-1 w-full max-w-xs"
          >
            <option value="pl">Polski</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="ru">Русский</option>
            <option value="es">Español</option>
            <option value="ua">Українська</option>
          </select>
        </div>
      </form>
    </div>
  )
}