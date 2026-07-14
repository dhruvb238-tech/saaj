import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { BRAND_CONFIG } from "@/config/brand";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND_CONFIG.meta.title,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description: BRAND_CONFIG.meta.description,
  metadataBase: new URL(BRAND_CONFIG.meta.url),
  openGraph: {
    title: BRAND_CONFIG.meta.title,
    description: BRAND_CONFIG.meta.description,
    url: BRAND_CONFIG.meta.url,
    siteName: BRAND_CONFIG.name,
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: BRAND_CONFIG.name,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_CONFIG.meta.title,
    description: BRAND_CONFIG.meta.description,
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Brand structured data for SEO (JSON-LD)
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ArtGallery",
    "name": BRAND_CONFIG.name,
    "image": `${BRAND_CONFIG.meta.url}${BRAND_CONFIG.logoPath}`,
    "description": BRAND_CONFIG.meta.description,
    "url": BRAND_CONFIG.meta.url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": BRAND_CONFIG.contact.location.split(",")[0].trim(),
      "addressCountry": "IN",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": BRAND_CONFIG.contact.whatsapp,
      "contactType": "sales",
    },
    "sameAs": [
      `https://instagram.com/${BRAND_CONFIG.contact.instagram}`,
    ],
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-brand-bg-primary text-brand-text-primary font-sans flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
