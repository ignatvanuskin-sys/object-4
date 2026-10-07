import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { MobileCta } from "@/components/mobile-cta";
import { RevealManager } from "@/components/reveal-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Display: Playfair Display — a high-contrast Didone with a full Cyrillic
 * subset. It replaces the condensed grotesque that made every headline read
 * like a template; at poster sizes on black it carries the horror/editorial
 * tone on its own. Body/UI stays Inter, which has reliable tabular figures for
 * the price grids.
 */
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

/** Set NEXT_PUBLIC_SITE_URL in the hosting environment (see .env.example). */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const title = `${site.mark} ${site.markIndex} — хоррор-квест в ${site.city}, ${site.region}`;
const description =
  `Хоррор-квест с живыми актёрами в ${site.city}. Две локации: «Дом проклятых» на 2–8 человек ` +
  `и «Пила» — одна команда до 10. Оценка ${site.rating} в 2ГИС при ${site.ratingsCount} оценках. ` +
  `Запись ежедневно ${site.hoursShort} — телефон, WhatsApp или заявка.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${site.mark} ${site.markIndex}`,
  },
  description,
  applicationName: `${site.mark} ${site.markIndex}`,
  keywords: [
    "хоррор-квест Рудный",
    "квест Рудный",
    "квесты Костанайская область",
    "Объект №4",
    "Дом проклятых",
    "Пила квест",
    "куда сходить Рудный",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: `${site.mark} ${site.markIndex}`,
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.mark} ${site.markIndex} — хоррор-квест в ${site.city}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  category: "entertainment",
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "@id": `${siteUrl}/#business`,
  name: `${site.mark} ${site.markIndex}`,
  alternateName: site.latin,
  description,
  url: siteUrl,
  image: `${siteUrl}/og.png`,
  telephone: "+77089419283",
  priceRange: "3500–40000 KZT",
  currenciesAccepted: "KZT",
  paymentAccepted: "Картой, наличными, через банк, по QR-коду",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.addressShort,
    addressLocality: site.city,
    addressRegion: site.region,
    postalCode: site.postalCode,
    addressCountry: "KZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.coords.lat,
    longitude: site.coords.lon,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:00",
      closes: "00:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: site.ratingsCount,
    reviewCount: site.reviewsCount,
  },
  sameAs: [site.instagram, site.twoGisCard],
  hasMap: site.twoGisCard,
  areaServed: { "@type": "City", name: site.city },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="label fixed top-4 left-4 z-[80] -translate-y-[200%] bg-signal px-5 py-3 text-white transition-transform focus-visible:translate-y-0"
        >
          К содержимому
        </a>

        <SiteHeader />

        <main id="main" className="pb-[86px] lg:pb-0">
          {children}
        </main>

        <SiteFooter />
        <MobileCta />
        <RevealManager />

        <script
          type="application/ld+json"
          // Company data comes from lib/site.ts and mirrors the open 2GIS card.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
