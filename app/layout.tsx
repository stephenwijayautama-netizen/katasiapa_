import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Kata Siapa — Ruang Untuk Berbagi Cerita",
  description: "Game kartu percakapan seru untuk anak muda, pasangan, dan keluarga. Temukan obrolan seru dan momen tak terduga.",
  icons: {
    icon: "/logo_icon_dark.png",
    apple: "/logo_icon_dark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className="dark"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
