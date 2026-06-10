'use client';
import { useBranch } from '@/components/Branch/BranchContext';
import GalleryAdminPageContent from './GalleryAdminPageContent';

export default function GalleryPage() {
  const { selectedBranch } = useBranch();
  // Ключ заставляет React пересоздавать компонент при смене филиала
  return <GalleryAdminPageContent key={selectedBranch?._id} />;
}