import { siteConfig } from '@/site.config'

export default function HeroCentered() {
  return (
    <section className="relative bg-zinc-900 text-white py-24 lg:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 to-zinc-900" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          {siteConfig.seo.title}
        </h1>
        <p className="text-lg lg:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
          {siteConfig.seo.description}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.features.hasBooking && (
            <a
              href="/reservations"
              className="inline-flex items-center px-8 py-4 rounded-lg text-white font-medium text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Забронировать
            </a>
          )}
          {siteConfig.features.hasMenu && (
            <a
              href="/menu"
              className="inline-flex items-center px-8 py-4 rounded-lg font-medium text-lg border-2 transition-colors hover:bg-white/10"
              style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
            >
              Меню
            </a>
          )}
        </div>

        {/* Доверие */}
        <div className="mt-12 flex justify-center gap-8 text-sm text-zinc-400">
          {siteConfig.features.hasDelivery && (
            <span>🚚 Доставка</span>
          )}
          {siteConfig.features.hasClickCollect && (
            <span>🛒 Самовывоз</span>
          )}
          <span>⭐ 4.9 рейтинг</span>
        </div>
      </div>
    </section>
  )
}