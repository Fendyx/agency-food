'use client'
import { useEffect, useState, useRef } from 'react'
import { useNotificationEvents } from '@/lib/useNotifications'
import ToastContainer, { ToastMessage } from '@/components/ui/Toast'

export default function AdminNotifications() {
  const { subscribe, unsubscribe, settings } = useNotificationEvents()
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const audioUnlockedRef = useRef(false)

  // Разблокировка звука при первом клике в любом месте
  useEffect(() => {
    const unlockAudio = () => {
      if (audioUnlockedRef.current) return

      // Создаём беззвучный звук и проигрываем
      const silentAudio = new Audio('/sounds/default.mp3')
      silentAudio.volume = 0
      silentAudio.play()
        .then(() => {
          audioUnlockedRef.current = true
        })
        .catch(() => {
          // если не удалось, попробуем позже
        })

      // Удаляем обработчик после первой попытки
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
    }

    document.addEventListener('click', unlockAudio)
    document.addEventListener('touchstart', unlockAudio)

    return () => {
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
    }
  }, [])

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
    }
  }

  const addToast = (text: string) => {
    const toastId = Date.now().toString()
    setToasts(prev => [...prev, { id: toastId, text, type: 'info' }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId))
    }, 5000)
  }

  const playSound = (soundFile?: string) => {
    try {
      // Проверяем, разблокирован ли звук
      if (!audioUnlockedRef.current) {
        console.warn('Звук ещё не разблокирован пользователем')
        return
      }

      const src = soundFile && soundFile !== 'custom' ? soundFile : '/sounds/default.mp3'
      const audio = new Audio(src)
      audio.play().catch(err => console.warn('Ошибка воспроизведения звука:', err))
    } catch (e) {
      console.warn('Ошибка создания Audio:', e)
    }
  }

  useEffect(() => {
    const handler = (reservation: any) => {
      const bookingSettings = settings?.booking || { sound: true, message: true }

      // Внутренний тост
      if (bookingSettings.message) {
        addToast(`Новое бронирование: ${reservation.name} на ${reservation.date} ${reservation.time}`)
      }

      // Звук (только после разблокировки)
      if (bookingSettings.sound) {
        playSound(bookingSettings.soundFile)
      }

      // Десктопное уведомление
      if (bookingSettings.message && permission === 'granted') {
        new Notification('Новое бронирование', {
          body: `${reservation.name} на ${reservation.date} в ${reservation.time}`,
          icon: '/favicon.svg',
        })
      }
    }

    subscribe('new_booking', handler)
    return () => unsubscribe('new_booking', handler)
  }, [subscribe, unsubscribe, settings, permission])

  return (
    <>
      <ToastContainer toasts={toasts} />
      {permission === 'default' && (
        <div className="fixed bottom-4 left-4 z-50 bg-white border border-zinc-300 rounded-lg shadow p-4 max-w-xs">
          <p className="text-sm mb-2">Разрешите уведомления, чтобы получать оповещения о новых бронированиях.</p>
          <button
            onClick={requestPermission}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Разрешить
          </button>
        </div>
      )}
      {permission === 'denied' && (
        <div className="fixed bottom-4 left-4 z-50 bg-white border border-zinc-300 rounded-lg shadow p-4 max-w-xs">
          <p className="text-sm text-red-600">Уведомления заблокированы. Измените настройки браузера.</p>
        </div>
      )}
      {!audioUnlockedRef.current && (
        <div className="fixed bottom-4 right-4 z-50 bg-white border border-zinc-300 rounded-lg shadow p-3 max-w-xs text-xs text-zinc-500">
          🔊 Кликните по странице, чтобы разблокировать звук уведомлений.
        </div>
      )}
    </>
  )
}