import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuickShortcuts } from "@/components/QuickShortcuts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Random Forest Wine Quality: Monograf Teknis & Bedah Matematis",
  description:
    "Dokumentasi komprehensif implementasi algoritma Random Forest (Bagging Ensemble) pada dataset UCI Wine Quality (N = 6.497). Bebas kebocoran data dengan bedah hitungan matematis lengkap.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-neutral-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuickShortcuts />
      </body>
    </html>
  );
}
