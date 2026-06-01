'use client'
import { useState } from 'react'
import MenuManager from '@/components/admin/MenuManager'

export default function AdminMenuPage() {
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('saas_token')
    }
    return null
  })

  if (!token) {
    // Если каким-то чудом токена нет (хотя AdminLayout уже проверил), покажем сообщение
    return <div className="text-center py-10">Требуется авторизация</div>
  }

  return <MenuManager token={token} />
}