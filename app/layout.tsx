import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import FontProvider from "@/context/font-provider";

const SITE_NAME = "BookStore";
const SITE_DESC = "BookStore — Cửa hàng sách trực tuyến: sách mới, sách cũ, khuyến mãi và giao hàng nhanh.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Cửa hàng sách trực tuyến`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  keywords: ["sách", "mua sách trực tuyến", "bookstore", "sách tiếng Việt", "khuyến mãi sách"],
  authors: [{ name: "BookStore", url: SITE_URL }],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: ["/file.svg"],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
    images: ["/file.svg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <Providers>
          <FontProvider>{children}</FontProvider>
        </Providers>
      </body>
    </html>
  );
}
