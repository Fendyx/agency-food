'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/site.config'
import { NotificationProvider } from '@/lib/useNotifications'
import AdminNotifications from '@/components/admin/AdminNotifications'
import { LayoutDashboard, UtensilsCrossed, ImageIcon, CalendarCheck, Megaphone, Settings, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'Меню', icon: UtensilsCrossed },
  { href: '/admin/gallery', label: 'Галерея', icon: ImageIcon },
  { href: '/admin/reservations', label: 'Бронирования', icon: CalendarCheck },
  { href: '/admin/gopublica', label: 'Gopublica', icon: Megaphone },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('saas_token')
    if (!savedToken) {
      router.push('/admin/login')
    } else {
      setToken(savedToken)
    }
  }, [])

  // Для страницы входа не показываем сайдбар
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
  }

  const handleLogout = () => {
    localStorage.removeItem('saas_token')
    router.push('/admin/login')
  }

  return (
    <NotificationProvider token={token}>
      <div className="flex min-h-screen bg-zinc-50">
        <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
          <div className="p-4 border-b border-zinc-200">
            <h2 className="font-bold text-lg">{siteConfig.clientName}</h2>
            <p className="text-xs text-zinc-500">Управление сайтом</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-zinc-200">
            <button onClick={handleLogout} className="w-full text-left text-sm text-zinc-500 hover:text-red-600">
              <LogOut size={16} className="inline mr-2" />
              Выйти
            </button>
          </div>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <AdminNotifications />
    </NotificationProvider>
  )
}