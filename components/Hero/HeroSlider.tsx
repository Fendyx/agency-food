'use client'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/site.config'
import { getTranslations } from 'next-intl/server'

const INTERVAL = 4000 // 4 секунды на слайд

export default async function HeroSlider() {
  const t = await getTranslations('hero')
  const images = siteConfig.heroSliderImages || []
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length === 0) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Слайды */}
      {images.map((img, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === current ? 1 : 0,
          }}
        />
      ))}

      {/* Оверлей */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Контент */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">{siteConfig.seo.title}</h1>
        <p className="text-lg lg:text-xl mb-10 opacity-90">{siteConfig.seo.description}</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.features.hasBooking && (
            <a href="#booking" className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)' }}>
              {t('booking')}
            </a>
          )}
          {siteConfig.features.hasMenu && (
            <a href="#menu" className="px-8 py-4 rounded-lg font-medium text-lg border-2 transition-colors hover:bg-white/10" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>
              {t('menu')}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}