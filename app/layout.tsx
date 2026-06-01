import { cookies } from 'next/headers';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'pl';

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}