'use client'
import { useState, useEffect } from 'react';
import { siteConfig } from '@/site.config';
import { useLocale } from 'next-intl';   // <-- добавить

interface TenantSettings {
  phone?: string;
  address?: string;
  email?: string;
  hours?: string;
  hoursI18n?: Record<string, string>;
  googleMapsUrl?: string;
  seoTitle?: string;
  seoTitleI18n?: Record<string, string>;
  seoDescription?: string;
  seoDescriptionI18n?: Record<string, string>;
  primaryLanguage?: string;
  primaryCurrency?: string;
}

export function useTenantSettings(tenantId: string) {
  const locale = useLocale();                    // <-- текущий язык
  const [rawSettings, setRawSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Вычисляем локализованные поля
  const settings = {
    phone: rawSettings?.phone || siteConfig.contact.phone,
    address: rawSettings?.address || siteConfig.contact.address,
    email: rawSettings?.email || siteConfig.contact.email,
    googleMapsUrl: rawSettings?.googleMapsUrl || siteConfig.contact.googleMapsUrl || '',
    primaryLanguage: rawSettings?.primaryLanguage || 'pl',
    primaryCurrency: rawSettings?.primaryCurrency || 'PLN',
    // seo поля с учётом перевода
    seoTitle: rawSettings?.seoTitleI18n?.[locale] || rawSettings?.seoTitle || siteConfig.seo.title,
    seoDescription: rawSettings?.seoDescriptionI18n?.[locale] || rawSettings?.seoDescription || siteConfig.seo.description,
    // часы работы
    hours: rawSettings?.hoursI18n?.[locale] || rawSettings?.hours || siteConfig.contact.hours,
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saas/settings?tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setRawSettings(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tenantId, locale]);    // перезапрашиваем при смене языка

  return { settings, loading };
}