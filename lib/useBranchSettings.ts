'use client';

import { useState, useEffect } from 'react';
import { useBranch } from '@/components/Branch/BranchContext';
import { siteConfig } from '@/site.config';

interface BranchSettings {
  phone: string;
  address: string;
  email: string;
  hours: string;
  googleMapsUrl: string;
  // можно добавить другие поля по необходимости
}

export function useBranchSettings(): BranchSettings & { loading: boolean } {
  const { selectedBranch, loading: branchLoading } = useBranch();
  const [settings, setSettings] = useState<BranchSettings>({
    phone: siteConfig.contact.phone,
    address: siteConfig.contact.address,
    email: siteConfig.contact.email,
    hours: siteConfig.contact.hours,
    googleMapsUrl: siteConfig.contact.googleMapsUrl || '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (branchLoading || !selectedBranch) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/saas/settings?tenantId=${siteConfig.tenantId}&branchId=${selectedBranch._id}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setSettings({
          phone: data.phone || siteConfig.contact.phone,
          address: data.address || siteConfig.contact.address,
          email: data.email || siteConfig.contact.email,
          hours: data.hours || siteConfig.contact.hours,
          googleMapsUrl: data.googleMapsUrl || siteConfig.contact.googleMapsUrl || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedBranch, branchLoading]);

  return { ...settings, loading: loading || branchLoading };
}