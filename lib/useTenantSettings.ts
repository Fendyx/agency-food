'use client'
import { useState, useEffect } from 'react';
import { siteConfig } from '@/site.config';

interface TenantSettings {
  phone?: string;
  address?: string;
  email?: string;
  hours?: string;
  googleMapsUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  primaryLanguage?: string;
}

export function useTenantSettings(tenantId: string) {
  const [settings, setSettings] = useState<TenantSettings>({
    phone: siteConfig.contact.phone,
    address: siteConfig.contact.address,
    email: siteConfig.contact.email,
    hours: siteConfig.contact.hours,
    googleMapsUrl: siteConfig.contact.googleMapsUrl || '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/settings?tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings({
            phone: data.phone || settings.phone,
            address: data.address || settings.address,
            email: data.email || settings.email,
            hours: data.hours || settings.hours,
            googleMapsUrl: data.googleMapsUrl || settings.googleMapsUrl,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
          });
        }
      })
      .catch(() => {
        // остаётся fallback из siteConfig
      })
      .finally(() => setLoading(false));
  }, [tenantId]);

  return { settings, loading };
}