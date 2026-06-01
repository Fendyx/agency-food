'use client'
import { useEffect, useState, useRef } from 'react'
import { siteConfig } from '@/site.config'
import MenuItemCard from '@/components/ui/MenuItemCard'
import type { MenuItem } from '@/types'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'твой-cloud-name'
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'menu_photos'

interface CategoryOption {
  _id?: string
  key: string
  name?: string
  translations: Record<string, string>
}

export default function MenuManager({ token }: { token: string }) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    categoryKey: '',
    image: '',
  })
  const [translations, setTranslations] = useState<Record<string, { name?: string; description?: string }>>({})

  // Категории
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [useCustomCategory, setUseCustomCategory] = useState(false)
  const [customCategoryName, setCustomCategoryName] = useState('')
  const [customCategoryTranslations, setCustomCategoryTranslations] = useState<Record<string, string>>({})

  // Автодополнение
  const [categorySuggestions, setCategorySuggestions] = useState<CategoryOption[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [widgetReady, setWidgetReady] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const cloudinaryWidgetRef = useRef<any>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const availableLangs = ['en', 'de', 'ru']

  const fetchItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/saas/menu?tenantId=${siteConfig.tenantId}`)
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка категорий
  useEffect(() => {
    if (!token) return
    fetch(`${apiUrl}/api/saas/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error)
  }, [token])

  useEffect(() => {
    fetchItems()
  }, [])

  // Cloudinary виджет
  useEffect(() => {
    if (document.getElementById('cloudinary-widget-script')) {
      if ((window as any).cloudinary && !cloudinaryWidgetRef.current) {
        initWidget()
      }
      return
    }
    const script = document.createElement('script')
    script.id = 'cloudinary-widget-script'
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
    script.async = true
    script.onload = () => initWidget()
    document.body.appendChild(script)
  }, [])

  const initWidget = () => {
    if (!(window as any).cloudinary) return
    cloudinaryWidgetRef.current = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFileSize: 5000000,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        language: 'ru',
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setForm((prev) => ({ ...prev, image: result.info.secure_url }))
        }
      }
    )
    setWidgetReady(true)
  }

  const openCloudinaryWidget = () => {
    if (cloudinaryWidgetRef.current && widgetReady) {
      cloudinaryWidgetRef.current.open()
    } else {
      alert('Загрузчик ещё не готов, подождите секунду и попробуйте снова.')
    }
  }

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, category: '', categoryKey: '', image: '' })
    setTranslations({})
    setSelectedCategory('')
    setUseCustomCategory(false)
    setCustomCategoryName('')
    setCustomCategoryTranslations({})
    setCategorySuggestions([])
    setShowSuggestions(false)
    setEditingId(null)
    setShowForm(false)
  }

  const updateCategoryFields = (key: string, isCustom: boolean, customName?: string) => {
    if (isCustom) {
      setUseCustomCategory(true)
      setSelectedCategory('')
      setForm(prev => ({
        ...prev,
        category: customName || '',
        categoryKey: customName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
      }))
    } else {
      setUseCustomCategory(false)
      setSelectedCategory(key)
      setCustomCategoryName('')
      setForm(prev => ({
        ...prev,
        category: key,
        categoryKey: key,
      }))
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingId(item._id || null)
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || '',
      categoryKey: item.categoryKey || '',
      image: item.image || '',
    })
    setTranslations(item.translations || {})

    const foundCat = categories.find(c => c.key === item.categoryKey)
    if (foundCat) {
      updateCategoryFields(foundCat.key, false)
    } else if (item.categoryKey) {
      setUseCustomCategory(true)
      setCustomCategoryName(item.category)
      setCustomCategoryTranslations(item.translations?.category as any || {})
      setSelectedCategory('')
    } else {
      const catByCategory = categories.find(c => c.key === item.category)
      if (catByCategory) {
        updateCategoryFields(catByCategory.key, false)
      } else {
        updateCategoryFields('', false)
      }
    }
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить блюдо?')) return
    try {
      await fetch(`${apiUrl}/api/saas/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const searchCategories = async (query: string) => {
    if (query.length < 2) {
      setCategorySuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const res = await fetch(`${apiUrl}/api/saas/categories/suggest?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setCategorySuggestions(data)
      setShowSuggestions(data.length > 0)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (useCustomCategory) {
      const categoryKey = customCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      try {
        await fetch(`${apiUrl}/api/saas/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            key: categoryKey,
            name: customCategoryName,
            translations: customCategoryTranslations,
          }),
        })
        setForm(prev => ({ ...prev, categoryKey, category: customCategoryName }))
      } catch (err) {
        console.error('Не удалось сохранить категорию', err)
      }
    }

    const url = editingId
      ? `${apiUrl}/api/saas/menu/${editingId}`
      : `${apiUrl}/api/saas/menu`
    const method = editingId ? 'PUT' : 'POST'

    const payload = {
      ...form,
      translations,
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        await fetchItems()
        resetForm()
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-center py-10">Загрузка меню...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Меню ресторана «{siteConfig.clientName}»
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded text-white text-sm font-medium"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {showForm ? '✕ Закрыть' : '+ Добавить блюдо'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded shadow mb-8 space-y-4 border border-zinc-200">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Название блюда"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />

            {/* Выбор категории */}
            <div>
              <label className="block text-sm font-medium text-zinc-700">Категория</label>
              <select
                value={useCustomCategory ? '__custom__' : selectedCategory}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === '__custom__') {
                    setUseCustomCategory(true)
                    setSelectedCategory('')
                  } else {
                    updateCategoryFields(val, false)
                  }
                }}
                className="w-full border p-2 rounded mt-1"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(c => (
                  <option key={c.key} value={c.key}>{c.name || c.key}</option>
                ))}
                <option value="__custom__">Своя категория</option>
              </select>
            </div>

            {useCustomCategory && (
              <>
                <div className="sm:col-span-2 relative">
                  <label className="block text-sm font-medium text-zinc-700">Название категории</label>
                  <input
                    type="text"
                    value={customCategoryName}
                    onChange={(e) => {
                      const name = e.target.value
                      setCustomCategoryName(name)
                      setForm(prev => ({
                        ...prev,
                        category: name,
                        categoryKey: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                      }))
                      searchCategories(name)
                    }}
                    onFocus={() => categorySuggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full border p-2 rounded mt-1"
                    required
                  />
                  {showSuggestions && (
                    <ul className="absolute z-10 w-full bg-white border border-zinc-300 rounded-b-lg shadow-dropdown max-h-40 overflow-y-auto">
                      {categorySuggestions.map(cat => (
                        <li
                          key={cat.key}
                          onMouseDown={() => {
                            setCustomCategoryName(cat.name || cat.key)
                            setCustomCategoryTranslations(cat.translations || {})
                            setForm(prev => ({
                              ...prev,
                              category: cat.name || cat.key,
                              categoryKey: cat.key,
                            }))
                            setShowSuggestions(false)
                          }}
                          className="px-3 py-2 text-sm hover:bg-surface-hover cursor-pointer"
                        >
                          <div className="font-medium">{cat.name || cat.key}</div>
                          {cat.translations && (
                            <div className="text-xs text-text-tertiary">
                              {Object.entries(cat.translations).map(([lang, val]) => `${lang}: ${val}`).join(', ')}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <details className="sm:col-span-2 mt-2">
                  <summary className="cursor-pointer text-sm font-medium text-text-secondary">
                    Переводы категории
                  </summary>
                  <div className="space-y-2 mt-2">
                    {availableLangs.map(lang => (
                      <div key={lang} className="border p-2 rounded">
                        <p className="text-xs font-medium">{lang.toUpperCase()}</p>
                        <input
                          type="text"
                          placeholder="Название"
                          value={customCategoryTranslations[lang] || ''}
                          onChange={(e) => setCustomCategoryTranslations(prev => ({
                            ...prev,
                            [lang]: e.target.value
                          }))}
                          className="w-full border p-1 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </details>
              </>
            )}

            <div className="sm:col-span-2">
              <textarea
                placeholder="Описание"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border p-2 rounded"
                rows={2}
              />
            </div>
            <input
              type="number"
              placeholder="Цена (zł)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex gap-2 items-end">
              <input
                type="text"
                placeholder="URL изображения"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={openCloudinaryWidget}
                className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 text-sm"
              >
                Загрузить
              </button>
            </div>
          </div>
          {form.image && (
            <img src={form.image} alt="Превью" className="h-32 object-cover rounded" />
          )}

          {/* Блок переводов блюда */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-text-secondary">
              Переводы блюда (опционально)
            </summary>
            <div className="space-y-2 mt-2">
              {availableLangs.map(lang => (
                <div key={lang} className="border p-2 rounded">
                  <p className="text-xs font-medium">{lang.toUpperCase()}</p>
                  <input
                    type="text"
                    placeholder="Название"
                    value={translations[lang]?.name || ''}
                    onChange={(e) => setTranslations(prev => ({
                      ...prev,
                      [lang]: { ...prev[lang], name: e.target.value }
                    }))}
                    className="w-full border p-1 rounded mb-1"
                  />
                  <input
                    type="text"
                    placeholder="Описание"
                    value={translations[lang]?.description || ''}
                    onChange={(e) => setTranslations(prev => ({
                      ...prev,
                      [lang]: { ...prev[lang], description: e.target.value }
                    }))}
                    className="w-full border p-1 rounded"
                  />
                </div>
              ))}
            </div>
          </details>

          <div className="flex justify-end gap-2">
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-500">
                Отмена
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded text-white font-medium"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {editingId ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-zinc-500 text-center py-10">Меню пока пусто. Добавьте первое блюдо.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              mode="admin"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}