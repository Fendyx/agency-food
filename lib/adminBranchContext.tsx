'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch } from '@/types';

interface AdminBranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  loading: boolean;
  refetchBranches: () => Promise<void>;
}

const AdminBranchContext = createContext<AdminBranchContextType | undefined>(undefined);

export function useAdminBranch() {
  const context = useContext(AdminBranchContext);
  if (!context) throw new Error('useAdminBranch must be used within AdminBranchProvider');
  return context;
}

interface Props {
  children: ReactNode;
  tenantId: string;
  token: string;
}

export function AdminBranchProvider({ children, tenantId, token }: Props) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch branches');
      const data = await res.json();
      setBranches(data);
      // Если еще нет выбранного филиала и есть хотя бы один, выбираем первый
      if (!selectedBranch && data.length > 0) {
        setSelectedBranch(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId && token) {
      fetchBranches();
    }
  }, [tenantId, token]);

  const refetchBranches = async () => {
    setLoading(true);
    await fetchBranches();
  };

  return (
    <AdminBranchContext.Provider
      value={{
        branches,
        selectedBranch,
        setSelectedBranch,
        loading,
        refetchBranches,
      }}
    >
      {children}
    </AdminBranchContext.Provider>
  );
}