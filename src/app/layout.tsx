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
  title: "Portfolio",
  description: "A minimal portfolio in Swiss design style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
