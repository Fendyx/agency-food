'use client';

import { useBranch } from '@/components/Branch/BranchContext';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/site.config';
import Menu from '@/components/Menu';
import type { MenuItem } from '@/types';

export default function MenuClient() {
  const { selectedBranch } = useBranch();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBranch) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/saas/menu?tenantId=${siteConfig.tenantId}&branchId=${selectedBranch._id}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedBranch]);

  if (loading) return <div className="text-center py-10">Загрузка меню...</div>;
  return <Menu items={items} />;
}