import './globals.css';
import { Providers } from "@/components/shared/providers";
import { Navbar } from "@/components/layout/navbar";
import { auth } from "@/auth";
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
});

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={`${dmSans.variable} ${cormorantGaramond.variable} dark`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="bg-[#10100e] text-[#f0ede6] selection:bg-[rgba(212,169,74,0.3)] font-sans">
        <Providers session={session}>
          <Navbar />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
