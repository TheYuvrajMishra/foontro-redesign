import type { Metadata } from "next";
import { Archivo_Black, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { LenisRoot } from "@/components/ui";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-x",
  display: "swap",
});

const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-sans-x",
  display: "swap",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono-x",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foontro.com"),
  title: "Foontro — Hire Verified Freelancers in India | Secure Escrow Payments",
  description:
    "Foontro is India's verified freelance marketplace. Every freelancer is human-verified, every rupee sits in escrow until you approve the work, and daily streaks earn metallic frames that boost your visibility.",
  keywords: [
    "freelance marketplace india",
    "hire verified freelancers",
    "escrow payments",
    "freelancer streaks",
  ],
  openGraph: {
    title: "Foontro — Verified people. Locked money. Zero ghosting.",
    description:
      "India's curated freelance marketplace: human-verified freelancers, escrow on every order, and streaks that earn you the frame.",
    url: "https://foontro.com",
    siteName: "Foontro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foontro — Verified people. Locked money. Zero ghosting.",
    description:
      "India's curated freelance marketplace: human-verified freelancers, escrow on every order, streaks that pay.",
  },
  robots: { index: true, follow: true },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Foontro",
      url: "https://foontro.com",
      slogan: "Verified people. Locked money. Zero ghosting.",
      areaServed: "IN",
      description:
        "India's verified freelance marketplace with escrow payments and gamified login streaks.",
    },
    {
      "@type": "WebSite",
      name: "Foontro",
      url: "https://foontro.com",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-void font-sans text-bone">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <LenisRoot />
        <div className="grain" aria-hidden="true" />
        {/* notebook margin rails */}
        <div
          className="margin-rail left-[max(0.75rem,calc((100vw-80rem)/2))] hidden lg:block"
          aria-hidden="true"
        />
        <div
          className="margin-rail right-[max(0.75rem,calc((100vw-80rem)/2))] hidden lg:block"
          aria-hidden="true"
        />
        <Nav />
        <main id="top">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
