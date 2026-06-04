import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/site.config'
import type { GalleryItem } from '@/types'
import GalleryBento from './GalleryBento'
import GalleryMasonry from './GalleryMasonry'

export default async function Gallery({ images }: { images: GalleryItem[] }) {
  const t = await getTranslations('gallery')
  const title = t('title')
  const subtitle = t('subtitle')   // например, "Наш ресторан"
  const style = siteConfig.galleryStyle || 'bento'

  if (style === 'masonry') {
    return <GalleryMasonry images={images} title={title} subtitle={subtitle} />
  }
  return <GalleryBento images={images} title={title} subtitle={subtitle} />
}