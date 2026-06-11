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
  primaryLanguage: string;
  primaryCurrency: string;
  seoTitle: string;                    // нелокализованный fallback
  seoDescription: string;              // нелокализованный fallback
  seoTitleI18n: Record<string, string>;
  seoDescriptionI18n: Record<string, string>;
  hoursI18n: Record<string, string>;
}

export function useBranchSettings(): BranchSettings & { loading: boolean } {
  const { selectedBranch, loading: branchLoading } = useBranch();
  const [settings, setSettings] = useState<BranchSettings>({
    phone: siteConfig.contact.phone,
    address: siteConfig.contact.address,
    email: siteConfig.contact.email,
    hours: siteConfig.contact.hours,
    googleMapsUrl: siteConfig.contact.googleMapsUrl || '',
    primaryLanguage: 'pl',
    primaryCurrency: 'PLN',
    seoTitle: siteConfig.seo?.title || '',
    seoDescription: siteConfig.seo?.description || '',
    seoTitleI18n: {},
    seoDescriptionI18n: {},
    hoursI18n: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (branchLoading || !selectedBranch) {
      if (!branchLoading && !selectedBranch) setLoading(false);
      return;
    }

    const cacheKey = `branch_settings_${selectedBranch._id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setSettings(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (e) {}
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/saas/settings?tenantId=${siteConfig.tenantId}&branchId=${selectedBranch._id}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const newSettings = {
          phone: data.phone || siteConfig.contact.phone,
          address: data.address || siteConfig.contact.address,
          email: data.email || siteConfig.contact.email,
          hours: data.hours || siteConfig.contact.hours,
          googleMapsUrl: data.googleMapsUrl || siteConfig.contact.googleMapsUrl || '',
          primaryLanguage: data.primaryLanguage || 'pl',
          primaryCurrency: data.primaryCurrency || 'PLN',
          seoTitle: data.seoTitle || siteConfig.seo?.title || '',
          seoDescription: data.seoDescription || siteConfig.seo?.description || '',
          seoTitleI18n: data.seoTitleI18n || {},
          seoDescriptionI18n: data.seoDescriptionI18n || {},
          hoursI18n: data.hoursI18n || {},
        };
        sessionStorage.setItem(cacheKey, JSON.stringify(newSettings));
        setSettings(newSettings);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedBranch, branchLoading]);

  return { ...settings, loading: loading || branchLoading };
}