'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch } from '@/types';

interface BranchContextType {
  branches: Branch[];
  cities: string[];
  selectedCity: string | null;
  selectedBranch: Branch | null;
  loading: boolean;
  setCity: (city: string) => void;
  setBranch: (branch: Branch) => void;
  detectCityByIp: () => Promise<void>;
  refetchBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranch must be used within BranchProvider');
  return context;
}


interface Props {
  children: ReactNode;
  tenantId: string;
}

export function BranchProvider({ children, tenantId }: Props) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const cities = [...new Set(branches.map(b => b.city).filter(c => c))];

  // Загружаем филиалы
useEffect(() => {
  if (!tenantId) return;
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/branches/public/${tenantId}`)
    .then(res => res.json())
    .then(data => {
      setBranches(data);
      detectCityByIp(data); // ← передаём данные
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [tenantId]);

  const refetchBranches = async () => {
  if (!tenantId) return;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/branches/public/${tenantId}`);
  const data = await res.json();
  setBranches(data);
  // если нужно, пересчитать города и выбрать первый
};

  // Функция определения города по IP
  const detectCityByIp = async (branchesData?: Branch[]) => {
  try {
    const res = await fetch('/api/geolocation');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const city = data?.city;

    if (city && branchesData && branchesData.length > 0) {
      const foundCity = branchesData.some(b => b.city?.toLowerCase() === city.toLowerCase());
      if (foundCity) {
        setSelectedCity(city);
        const firstBranchInCity = branchesData.find(b => b.city?.toLowerCase() === city.toLowerCase());
        if (firstBranchInCity) setSelectedBranch(firstBranchInCity);
        return;
      }
    }

    // fallback: первый город, первый филиал
    if (branchesData && branchesData.length > 0) {
      const cities = [...new Set(branchesData.map(b => b.city).filter(Boolean))];
      const firstCity = cities[0] || branchesData[0].city;
      if (firstCity) setSelectedCity(firstCity);
      const firstBranch = branchesData.find(b => b.city === firstCity);
      if (firstBranch) setSelectedBranch(firstBranch);
    }
  } catch (err) {
    console.error('IP detection failed', err);
    // fallback на первый филиал
    if (branchesData && branchesData.length > 0) {
      const cities = [...new Set(branchesData.map(b => b.city).filter(Boolean))];
      const firstCity = cities[0] || branchesData[0].city;
      if (firstCity) setSelectedCity(firstCity);
      const firstBranch = branchesData.find(b => b.city === firstCity);
      if (firstBranch) setSelectedBranch(firstBranch);
    }
  }
};

  const setCity = (city: string) => {
    setSelectedCity(city);
    const branchInCity = branches.find(b => b.city === city);
    if (branchInCity) setSelectedBranch(branchInCity);
  };

  const setBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedCity(branch.city);
  };

  return (
    <BranchContext.Provider value={{
      branches,
      cities,
      selectedCity,
      selectedBranch,
      loading,
      setCity,
      setBranch,
      detectCityByIp,
     refetchBranches
    }}>
      {children}
    </BranchContext.Provider>
  );
}