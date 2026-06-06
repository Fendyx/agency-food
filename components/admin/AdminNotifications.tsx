'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useNotificationEvents } from '@/lib/useNotifications'

export default function AdminNotifications() {
  const { subscribe, unsubscribe, settings, pushSubscribed, pushError, subscribeToPush } = useNotificationEvents()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Храним актуальный обработчик в ref, чтобы подписка не слетала при ре-рендерах
  const handlerRef = useRef<(reservation: any) => void>(() => {})

  // playSound стабилен (useCallback с [])
  const playSound = useCallback((soundFile?: string) => {
    if (document.hidden || !audioRef.current) return
    const src = soundFile && soundFile !== 'custom' ? soundFile : '/sounds/default.mp3'
    if (!audioRef.current.src.endsWith(src)) {
      audioRef.current.src = src
      audioRef.current.load()
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }, [])

  // Обновляем ref при изменении зависимостей
  useEffect(() => {
    handlerRef.current = (reservation: any) => {
  console.log('🔔 handler called!', reservation.name, reservation._id);
  const s = settings?.booking || { sound: true, message: true };
  console.log('⚙️ settings.booking:', s);
  console.log('🔊 audioRef.current:', audioRef.current);
  console.log('🔔 permission:', permission, 'document.hidden:', document.hidden);

  // Пробуем звук в любом случае для теста (даже если s.sound false)
  if (audioRef.current) {
    console.log('▶️ Пытаюсь играть звук...');
    audioRef.current.play()
      .then(() => console.log('✅ Звук играет'))
      .catch(e => console.error('❌ Ошибка звука:', e));
  } else {
    console.warn('❌ audioRef.current отсутствует');
  }

  // Пробуем браузерное уведомление без проверки document.hidden для теста
  if (permission === 'granted') {
    console.log('📢 Показываю уведомление');
    new Notification('🍽️ Тестовое уведомление', {
      body: `${reservation.name} · ${reservation.date} в ${reservation.time}`,
      icon: '/favicon.svg',
      requireInteraction: true,
    });
  } else {
    console.warn('❌ Нет разрешения на уведомления, permission:', permission);
  }
};
  }, [settings, permission, playSound])

  // Подписка/отписка только при монтировании/размонтировании
  useEffect(() => {
    console.log('🔔 Subscribing to new_booking')
    const stableHandler = (data: any) => handlerRef.current(data)
    subscribe('new_booking', stableHandler)
    return () => {
      console.log('🔔 Unsubscribing from new_booking')
      unsubscribe('new_booking', stableHandler)
    }
  }, [subscribe, unsubscribe]) // subscribe/unsubscribe стабильны

  // Инициализация разрешений
  useEffect(() => {
    if (!('Notification' in window)) return
    setPermission(Notification.permission)
    if (Notification.permission === 'default') setShowBanner(true)
  }, [])

  // Создание и разблокировка аудио (сохраняем элемент сразу)
  useEffect(() => {
    const audio = new Audio('/sounds/default.mp3')
    audio.preload = 'auto'
    audio.volume = 1
    audioRef.current = audio // сохраняем сразу, чтобы playSound мог работать даже до разблокировки

    audio.play()
      .then(() => {
        audio.pause()
        audio.currentTime = 0
        setAudioUnlocked(true)
      })
      .catch(() => {
        const unlock = () => {
          audio.play().then(() => {
            audio.pause()
            audio.currentTime = 0
            setAudioUnlocked(true)
            document.removeEventListener('click', unlock)
            document.removeEventListener('keydown', unlock)
          }).catch(() => {})
        }
        document.addEventListener('click', unlock, { once: true })
        document.addEventListener('keydown', unlock, { once: true })
      })
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result)
    setShowBanner(false)
    if (result === 'granted') {
      setIsSubscribing(true)
      await subscribeToPush()
      setIsSubscribing(false)
    }
  }

  const handleSubscribeToPush = async () => {
    setIsSubscribing(true)
    await subscribeToPush()
    setIsSubscribing(false)
  }

  return (
    <>
      {/* Шаг 1: Запрос разрешения браузера */}
      {showBanner && permission === 'default' && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 max-w-sm">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="text-sm font-semibold text-zinc-800">Включите уведомления</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Получайте оповещения о новых бронированиях даже при закрытых вкладках.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={requestPermission}
              disabled={isSubscribing}
              className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isSubscribing ? 'Подключение...' : 'Разрешить'}
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-3 py-1.5 text-zinc-500 hover:text-zinc-700 rounded-lg text-sm transition-colors"
            >
              Позже
            </button>
          </div>
        </div>
      )}

      {/* Уведомления заблокированы */}
      {permission === 'denied' && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-red-100 rounded-xl shadow-lg p-4 max-w-sm">
          <p className="text-sm font-medium text-red-600">🚫 Уведомления заблокированы</p>
          <p className="text-xs text-zinc-500 mt-1">
            Нажмите на замок 🔒 в адресной строке → Уведомления → Разрешить.
          </p>
        </div>
      )}

      {/* Шаг 2: Разрешение есть, но push ещё не подписан */}
      {permission === 'granted' && !pushSubscribed && !showBanner && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-amber-200 rounded-xl shadow-lg p-4 max-w-sm">
          <p className="text-sm font-semibold text-amber-700">⚡ Фоновые уведомления</p>
          <p className="text-xs text-zinc-500 mt-1 mb-3">
            Без этого уведомления не придут при закрытых вкладках.
          </p>
          {pushError && (
            <p className="text-xs text-red-500 mb-2 bg-red-50 p-2 rounded">
              ❌ {pushError}
            </p>
          )}
          <button
            onClick={handleSubscribeToPush}
            disabled={isSubscribing}
            className="w-full px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isSubscribing ? 'Подключение...' : pushError ? 'Попробовать снова' : 'Включить'}
          </button>
        </div>
      )}

      {/* Подсказка о звуке */}
      {!audioUnlocked && permission === 'granted' && (
        <div className="fixed bottom-4 right-4 z-50 bg-zinc-800 text-white rounded-xl shadow p-3 max-w-xs text-xs flex items-center gap-2">
          <span>🔊</span>
          <span>Кликните по странице чтобы включить звук</span>
        </div>
      )}
    </>
  )
}