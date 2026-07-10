import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://hanifa.offlix.app"),

  title: {
    default: "Abu-Hanifa Installation",
    template: "%s | Abu-Hanifa Installation",
  },
  
  verification: {
    google: "FtolZh8OJ9N57Cl2H143vSCzDUbQZLIaoU6PfKV5CK4",
  },

  description:
    "Abu-Hanifa Installation provides professional electrical installation, plumbing, maintenance, wiring, and general installation services across Ethiopia, especially Addis Ababa, Worabe, Halaba, Butajira, and Central Ethiopia.",

  keywords: [
    "Abu Hanifa",
    "Hanifa",
    "Abu-Hanifa",
    "Abu Hanifa Installation",
    "Hanifa Installation",

    "Electrical installation",
    "Electrical installation Ethiopia",
    "Electrician",
    "Electrician Ethiopia",
    "Electrician Addis Ababa",
    "Electrician Worabe",
    "Electrician Halaba",
    "Electrician Butajira",
    "Electrician Central Ethiopia",

    "Plumbing",
    "Plumber",
    "Plumbing services",
    "Plumber Ethiopia",
    "Plumber Addis Ababa",
    "Plumber Worabe",
    "Plumber Halaba",
    "Plumber Butajira",

    "General installation",
    "Electrical maintenance",
    "Building maintenance",
    "Electrical wiring",
    "House wiring",
    "Commercial electrical services",

    "Addis Ababa",
    "Worabe",
    "Halaba",
    "Butajira",
    "Central Ethiopia",
    "Ethiopia",
  ],

  authors: [{ name: "Abu-Hanifa Installation" }],
  creator: "Abu-Hanifa Installation",
  publisher: "Abu-Hanifa Installation",

  alternates: {
    canonical: "https://hanifa.offlix.app",
  },

  openGraph: {
    title: "Abu-Hanifa Installation",
    description:
      "Professional electrical installation and plumbing services across Ethiopia.",
    url: "https://hanifa.offlix.app",
    siteName: "Abu-Hanifa Installation",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://hanifa.offlix.app/images/logo.jpg",
        width: 512,
        height: 512,
        alt: "Abu-Hanifa Installation Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Abu-Hanifa Installation",
    description:
      "Professional electrical installation and plumbing services across Ethiopia.",
    images: ["https://hanifa.offlix.app/images/logo.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Abu-Hanifa Installation",
    alternateName: [
      "Hanifa Installation",
      "Abu Hanifa",
      "Hanifa",
    ],
    url: "https://hanifa.offlix.app",
    logo: "https://hanifa.offlix.app/images/logo.jpg",
    image: "https://hanifa.offlix.app/images/logo.jpg",
    email: "abuhanifainstallation@gmail.com",
    telephone: [
      "+251936489696",
      "+251705489696"
    ],
    description:
      "Professional electrical installation, plumbing, maintenance, and general installation services in Ethiopia.",
    areaServed: [
      "Ethiopia",
      "Addis Ababa",
      "Worabe",
      "Halaba",
      "Butajira",
      "Central Ethiopia"
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "ET",
    },
    knowsAbout: [
      "Electrical Installation",
      "Electrical Wiring",
      "Electrical Maintenance",
      "Plumbing",
      "General Installation",
      "Building Maintenance"
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+251936489696",
        contactType: "customer service",
        areaServed: "ET",
        availableLanguage: ["English", "Amharic"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+251705489696",
        contactType: "customer service",
        areaServed: "ET",
        availableLanguage: ["English", "Amharic"],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {children}
      </body>
    </html>
  );
}