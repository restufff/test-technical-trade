import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Indodax - Indonesia Crypto Exchange (Trading Simulator)',
  description: 'Jual Beli Bitcoin, Ethereum, USDT dan Aset Kripto Lainnya dengan Rupiah di Platform Trading Simulator Modern.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className="bg-background text-gray-100 min-h-screen antialiased selection:bg-indodax-cyan selection:text-black"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
