'use client';

import { useBranch } from '@/components/Branch/BranchContext';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/site.config';
import type { GalleryItem } from '@/types';
import GalleryBento from './GalleryBento';
import GalleryMasonry from './GalleryMasonry';

export default function GalleryClient() {
  const { selectedBranch } = useBranch();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBranch) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/saas/gallery?tenantId=${siteConfig.tenantId}&branchId=${selectedBranch._id}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedBranch]);

  if (loading) return <div className="text-center py-10">Загрузка галереи...</div>;

  const style = siteConfig.galleryStyle || 'bento';
  // Заголовки можно будет вынести в переводы, пока статика
  const title = "Наша галерея";
  const subtitle = "";

  if (style === 'masonry') {
    return <GalleryMasonry images={images} title={title} subtitle={subtitle} />;
  }
  return <GalleryBento images={images} title={title} subtitle={subtitle} />;
}