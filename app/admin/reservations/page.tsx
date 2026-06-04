'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('admin.reservationsPage')
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

  const deleteReservation = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/reservations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchReservations()
  }

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('statusLabels.pending'),
      confirmed: t('statusLabels.confirmed'),
      cancelled: t('statusLabels.cancelled'),
    }
    return labels[status] || status
  }

  if (loading) {
    return <div className="text-center py-16 text-text-secondary">{t('loading')}</div>
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <h2 className="text-2xl font-heading font-semibold text-text-primary mb-8">
        {t('title')}
      </h2>

      {reservations.length === 0 ? (
        <div className="text-center py-16 px-4 bg-surface-card rounded-2xl border border-dashed border-border">
          <p className="text-text-secondary">{t('empty')}</p>
        </div>
      ) : (
        <div className="bg-surface-card rounded-2xl shadow-card border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-surface-page border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{t('name')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{t('date')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{t('time')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{t('guests')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{t('status')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {reservations.map((r) => (
                  <tr key={r._id} className="hover:bg-surface-hover transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{r.name}</div>
                      {r.phone && <div className="text-xs text-text-tertiary mt-0.5">{r.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{r.date}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{r.time}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <span className="inline-flex items-center justify-center bg-surface-page border border-border rounded-lg px-2.5 py-1 font-medium">
                        {r.guests}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          r.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                            : r.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                        }`}
                      >
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        {/* Кнопки изменения статуса */}
                        {r.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(r._id, 'confirmed')}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                            >
                              {t('confirm')}
                            </button>
                            <button
                              onClick={() => updateStatus(r._id, 'cancelled')}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                            >
                              {t('reject')}
                            </button>
                          </>
                        )}
                        {r.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(r._id, 'cancelled')}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary bg-surface-page border border-border hover:bg-surface-hover hover:text-rose-600 transition-colors"
                          >
                            {t('cancel')}
                          </button>
                        )}
                        {r.status === 'cancelled' && (
                          <span className="text-text-tertiary text-sm px-3">—</span>
                        )}

                        {/* Кнопка удаления (для всех) */}
                        <button
                          onClick={() => deleteReservation(r._id)}
                          title={t('delete')}
                          className="p-1.5 rounded-lg text-text-tertiary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          {/* Иконка корзины */}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4h10l-1 9H3L2 4z" />
                            <path d="M5 4V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}