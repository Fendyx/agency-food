'use client';
import { useBranch } from '@/components/Branch/BranchContext';
import ReservationsPageContent from './ReservationsPageContent';

export default function ReservationsPage() {
  const { selectedBranch } = useBranch();
  // Ключ заставляет React пересоздавать компонент при смене филиала
  return <ReservationsPageContent key={selectedBranch?._id} />;
}