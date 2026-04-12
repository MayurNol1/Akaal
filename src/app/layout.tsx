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


export const metadata = {
  title: {
    default: "Akaal — Eternal Sanctuary | Sacred Spiritual Artifacts",
    template: "%s | Akaal Spiritual Arts",
  },
  description: "Handcrafted sacred artifacts, ethically sourced from the Himalayas. Rudraksha malas, singing bowls, crystals and more — each energised with Prana Pratishtha before reaching your home.",
  keywords: ["spiritual artifacts", "rudraksha", "sacred items", "puja", "meditation", "himalayas", "akaal"],
  openGraph: {
    title: "Akaal — Eternal Sanctuary",
    description: "Handcrafted sacred artifacts from the Himalayas.",
    images: [{ url: "/images/final-full-image.png", width: 2320, height: 2880, alt: "Akaal — Eternal Sanctuary" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akaal — Eternal Sanctuary",
    description: "Handcrafted sacred artifacts from the Himalayas.",
    images: ["/images/final-full-image.png"],
  },
  icons: {
    icon: [
      { url: "/images/BG_removed/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/BG_removed/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/BG_removed/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/images/BG_removed/apple-touch-icon.png",
    shortcut: "/images/BG_removed/favicon.ico",
  },
};

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
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="bg-background-dark text-[#f0ede6] selection:bg-[rgba(212,169,74,0.3)] font-sans">
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
