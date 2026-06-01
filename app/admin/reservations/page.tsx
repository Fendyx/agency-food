'use client'
import { useEffect, useState } from 'react'

type Reservation = {
  _id: string
  name: string
  phone: string
  email?: string
  date: string
  time: string
  guests: number
  comment?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setReservations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/reservations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
    fetchReservations()
  }

  if (loading) return <div className="text-center py-10">Загрузка...</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Бронирования</h2>
      {reservations.length === 0 ? (
        <p className="text-zinc-500">Пока нет бронирований.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-left">
            <thead className="bg-zinc-100">
              <tr>
                <th className="p-3">Имя</th>
                <th className="p-3">Дата</th>
                <th className="p-3">Время</th>
                <th className="p-3">Гостей</th>
                <th className="p-3">Статус</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.time}</td>
                  <td className="p-3">{r.guests}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        r.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : r.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {r.status === 'pending' ? 'Новый' : r.status === 'confirmed' ? 'Подтверждён' : 'Отклонён'}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(r._id, 'confirmed')}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Подтв.
                        </button>
                        <button
                          onClick={() => updateStatus(r._id, 'cancelled')}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Откл.
                        </button>
                      </>
                    )}
                    {r.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(r._id, 'cancelled')}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Отменить
                      </button>
                    )}
                    {r.status === 'cancelled' && (
                      <span className="text-zinc-400 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}