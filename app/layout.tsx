import type { Metadata } from "next"
import { Noto_Serif_SC, Noto_Sans_SC } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import ImageProtect from "../components/ImageProtect"
import "./globals.css"
import Navbar from "../components/Navbar"
import ContactWidget from "../components/ContactWidget"
import BackToTop from "../components/BackToTop"

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
  metadataBase: new URL("https://www.hetu-pattern.com"),
  title: {
    default: "河图纹画 · 中国传统纹样复原与创新设计",
    template: "%s | 河图纹画",
  },
  description:
    "河图纹画 —— 中国传统纹样复原、创新设计与品牌合作平台。考据出土文物与博物馆藏品严谨复原历代纹样，提供纹样素材库、单件授权与定制设计服务。",
  keywords: [
    "中国传统纹样",
    "纹样复原",
    "纹样设计",
    "传统纹样素材",
    "敦煌纹样",
    "唐代纹样",
    "宋代纹样",
    "纹样库",
    "纹样下载",
    "纹样授权",
    "中国古代纹样",
    "中国历代经典纹样",
    "纹样定制",
    "品牌纹样设计",
    "传统纹样设计",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo/logo-dragon.webp",
    apple: "/logo/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "河图",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://www.hetu-pattern.com",
    siteName: "河图纹画",
    title: "河图纹画 · 中国传统纹样复原与创新设计",
    description:
      "考据出土文物与博物馆藏品严谨复原历代纹样，提供纹样素材库、单件授权与定制设计服务。",
    images: [
      {
        url: "/images/banner/初唐-四人飞天.webp",
        width: 1200,
        height: 630,
        alt: "河图纹画 · 中国传统纹样",
      },
    ],
  },
  alternates: {
    canonical: "/",
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
        <ContactWidget />
        <BackToTop />
        <Analytics />
        <ImageProtect />
        {/* 结构化数据：帮助百度/Google 理解站点身份与书籍信息 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.hetu-pattern.com/#organization",
                  name: "河图纹画",
                  url: "https://www.hetu-pattern.com",
                  logo: "https://www.hetu-pattern.com/logo/logo-dragon.webp",
                  description: "中国传统纹样复原、创新设计与品牌合作平台",
                  founder: { "@type": "Person", name: "邵爱涵" },
                  address: { "@type": "PostalAddress", addressCountry: "CN" },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.hetu-pattern.com/#website",
                  url: "https://www.hetu-pattern.com",
                  name: "河图纹画",
                  inLanguage: "zh-CN",
                  publisher: { "@id": "https://www.hetu-pattern.com/#organization" },
                },
                {
                  "@type": "Book",
                  name: "中国历代经典纹样",
                  author: { "@type": "Person", name: "邵爱涵" },
                  publisher: { "@type": "Organization", name: "江苏人民出版社" },
                  isbn: "9787214269690",
                  datePublished: "2025",
                  inLanguage: "zh-CN",
                },
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  regs.forEach(function(reg) { reg.unregister(); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
