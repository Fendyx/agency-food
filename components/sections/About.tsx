import { siteConfig } from '@/site.config'

export default function About() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">О нас</h2>
        <p className="text-center text-zinc-600 max-w-2xl mx-auto">
          {siteConfig.seo.description}
        </p>
      </div>
    </section>
  )
}