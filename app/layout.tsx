import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/providers/auth';
import { LocaleProvider } from '@/lib/providers/locale';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carbon Emissions Calculator',
  description: 'Calculate and track your carbon emissions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LocaleProvider>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
