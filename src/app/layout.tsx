import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { RegionProvider } from "@/context/RegionContext";
import Header from "@/components/Header";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import LazySection from "@/components/LazySection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://factorybuyo.com";
const SITE_NAME = "FactoryBuyo";
const DEFAULT_DESCRIPTION =
  "Trending gaming laptops and certified pre-owned laptops for India and Singapore. Reserve online, confirm on WhatsApp — no card details needed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Gaming & Pre-Owned Laptops`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: `${SITE_NAME} — Gaming & Pre-Owned Laptops`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Gaming & Pre-Owned Laptops`,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ConvexClientProvider>
          <RegionProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <LazySection minHeight={260}>
              <TrustBadges />
            </LazySection>
            <Footer />
          </RegionProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
