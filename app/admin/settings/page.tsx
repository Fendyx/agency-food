'use client';
import { useBranch } from '@/components/Branch/BranchContext';
import SettingsPageContent from './SettingsPageContent';

export default function SettingsPage() {
  const { selectedBranch } = useBranch();
  // Ключ заставляет React пересоздавать компонент при смене филиала
  return <SettingsPageContent key={selectedBranch?._id} />;
}