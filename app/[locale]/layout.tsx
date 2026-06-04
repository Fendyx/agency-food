import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Café Oliv', 
  description: 'Restaurant',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <div className={`${inter.variable} ${playfair.variable}`}>
      <NextIntlClientProvider messages={messages}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </NextIntlClientProvider>
    </div>
  );
}