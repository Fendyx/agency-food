'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { siteConfig } from '@/site.config'

type NotificationSettings = {
  sound: boolean
  message: boolean
  soundFile?: string
}

type EventHandler = (data: any) => void

interface NotificationContextType {
  subscribe: (eventType: string, handler: EventHandler) => void
  unsubscribe: (eventType: string, handler: EventHandler) => void
  settings: Record<string, NotificationSettings>
}

const NotificationContext = createContext<NotificationContextType>({
  subscribe: () => {},
  unsubscribe: () => {},
  settings: {},
})

export function NotificationProvider({ children, token }: { children: React.ReactNode; token: string }) {
  const [settings, setSettings] = useState<Record<string, NotificationSettings>>({})
  const handlersRef = useRef<Record<string, EventHandler[]>>({})
  const previousDataRef = useRef<Record<string, any[]>>({})

  // Загрузка настроек уведомлений
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/settings?tenantId=${siteConfig.tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (data.notifications) {
          setSettings(data.notifications)
        }
      })
      .catch(console.error)
  }, [])

  // Polling для бронирований (можно расширить на другие типы)
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const prev = previousDataRef.current['booking'] || []
        if (prev.length > 0) {
          const newItems = data.filter((item: any) => !prev.find((p: any) => p._id === item._id))
          newItems.forEach((item: any) => {
            if (item.status === 'pending') {
              // Вызываем обработчики события 'new_booking'
              (handlersRef.current['new_booking'] || []).forEach(handler => handler(item))
            }
          })
        }
        previousDataRef.current['booking'] = data
      } catch (err) {
        // ignore
      }
    }

    // Первый запуск сразу, затем каждые 15 секунд
    poll()
    const interval = setInterval(poll, 15000)
    return () => clearInterval(interval)
  }, [token])

  const subscribe = useCallback((eventType: string, handler: EventHandler) => {
    if (!handlersRef.current[eventType]) {
      handlersRef.current[eventType] = []
    }
    handlersRef.current[eventType].push(handler)
  }, [])

  const unsubscribe = useCallback((eventType: string, handler: EventHandler) => {
    if (!handlersRef.current[eventType]) return
    handlersRef.current[eventType] = handlersRef.current[eventType].filter(h => h !== handler)
  }, [])

  return (
    <NotificationContext.Provider value={{ subscribe, unsubscribe, settings }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationEvents() {
  return useContext(NotificationContext)
}