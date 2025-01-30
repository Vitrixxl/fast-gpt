import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import '~/styles/globals.css';
import { env } from '~/env';
import { cookies } from 'next/headers';

const playfair_display = Playfair_Display({
  variable: '--font-playfair-display-sans',
  subsets: ['latin'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fast-gpt',
  description: 'The fastest ai site on the market',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;

  return (
    <html lang='en' className={theme ? theme : ''}>
      {env.SCAN && (
        <script src='https://unpkg.com/react-scan/dist/auto.global.js' async />
      )}

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair_display.variable} font-sans antialiased min-h-screen `}
      >
        {children}
      </body>
    </html>
  );
}
