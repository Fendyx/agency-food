import { siteConfig } from '@/site.config'
import type { GalleryItem } from '@/types'
import GalleryBento from './GalleryBento'
import GalleryMasonry from './GalleryMasonry'

export default function Gallery({ images }: { images: GalleryItem[] }) {
  const style = siteConfig.galleryStyle || 'bento'

  if (style === 'masonry') {
    return <GalleryMasonry images={images} />
  }

  // По умолчанию – bento
  return <GalleryBento images={images} />
}