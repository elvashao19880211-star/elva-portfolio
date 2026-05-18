import type { Metadata } from "next"
import { Noto_Serif_SC, Noto_Sans_SC } from "next/font/google"
import "./globals.css"
import Navbar from "../components/Navbar"

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
})

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "河图 · 华夏纹样传承",
  description: "传统纹样复原 · 创新设计 · 品牌合作 · 纹样库与交流平台 —— 以千年纹样，续华夏脉络",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo/logo-square.svg",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "河图",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <head>
        <meta name="theme-color" content="#3F9EAC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="河图" />
      </head>
      <body className="font-sans">
        <Navbar />
        <main className="pt-20">{children}</main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
