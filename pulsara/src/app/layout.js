import { Instrument_Serif, JetBrains_Mono, Geist } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Pulsara — Stop missing deadlines.',
  description: 'Community-verified deadline board for Egyptian university students. Anonymous, trusted, always on.',
  keywords: ['pulsara', 'deadlines', 'university', 'exams', 'HNU', 'CS Faculty'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${geist.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
