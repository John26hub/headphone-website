import './globals.css';
import { Inter, Outfit, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata = {
  title: 'SONANCE Zero | Hear The Future',
  description: 'The next generation of wireless audio.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
