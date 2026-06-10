import { cookies } from 'next/headers';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { BranchProvider } from '@/components/Branch/BranchContext';
import { siteConfig } from '@/site.config';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'pl';
  const tenantId = siteConfig.tenantId || process.env.NEXT_PUBLIC_TENANT_ID || '';

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider defaultTheme="light">
          <BranchProvider tenantId={tenantId}>
            {children}
          </BranchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}