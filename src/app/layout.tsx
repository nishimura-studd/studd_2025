import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import DesignGrid from "./components/DesignGrid";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "studd. | スタッド.",
    template: "%s | studd."
  },
  description: "インタラクティブなUI開発に取り組み、モダンな技術を活用してWebアプリケーションを制作しています。",
  keywords: ["Kuniyoshi Nishimura", "西村國芳", "studd", "studdjp", "スタッド", "portfolio", "web development", "3D visualization", "audio visualization"],
  authors: [{ name: "studd" }],
  creator: "studd",
  publisher: "studd",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://studd.jp'),
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    title: 'studd. | スタッド.',
    description: 'インタラクティブなUI開発に取り組み、モダンな技術を活用してWebアプリケーションを制作しています。',
    siteName: 'studd. Portfolio'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'studd. | スタッド.',
    description: 'インタラクティブなUI開発に取り組み、モダンな技術を活用してWebアプリケーションを制作しています。'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // other: 'your-other-verification-code',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
        style={{background: 'var(--background)'}}
      >
        <AuthProvider>
          <Navigation />
          <main className="pt-24">
            {children}
          </main>
          <DesignGrid />
        </AuthProvider>
      </body>
    </html>
  );
}
