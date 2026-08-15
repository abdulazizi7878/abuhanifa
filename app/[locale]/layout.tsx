import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abuhanifainstallation.com"),

  title: {
    default: "Abuhanifa Installation",
    template: "%s | Abuhanifa Installation",
  },
  
  verification: {
    google: "FtolZh8OJ9N57Cl2H143vSCzDUbQZLIaoU6PfKV5CK4",
  },

  description:
    "Abuhanifa Installation provides professional electrical installation, plumbing, maintenance, wiring, and general installation services across Ethiopia, especially Addis Ababa, Worabe, Halaba, Butajira, and Central Ethiopia.",

  keywords: [
    "Abu Hanifa",
    "Hanifa",
    "Abu-Hanifa",
    "Abu Hanifa Installation",
    "Hanifa Installation",
    "abuhanifainstallation.com",
    "abuhanifainstallation",
    "abuhanifa installation",
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

  authors: [{ name: "Abuhanifa Installation" }],
  creator: "Abuhanifa Installation",
  publisher: "Abuhanifa Installation",

  alternates: {
    canonical: "https://abuhanifainstallation.com",
  },

  openGraph: {
    title: "Abuhanifa Installation",
    description:
      "Professional electrical installation and plumbing services across Ethiopia.",
    url: "https://abuhanifainstallation.com",
    siteName: "Abuhanifa Installation",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://abuhanifainstallation.com/images/logo.jpg",
        width: 512,
        height: 512,
        alt: "Abu-Hanifa Installation Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Abuhanifa Installation",
    description:
      "Professional electrical installation and plumbing services across Ethiopia.",
    images: ["https://abuhanifainstallation.com/images/logo.jpg"],
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>) {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Abuhanifa Installation",
    alternateName: [
      "Hanifa Installation",
      "Abuhanifa",
      "Hanifa",
    ],
    url: "https://abuhanifainstallation.com",
    logo: "https://abuhanifainstallation.com/images/logo.jpg",
    image: "https://abuhanifainstallation.com/images/logo.jpg",
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
        availableLanguage: ["English", "Amharic","Arabic"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+251705489696",
        contactType: "customer service",
        areaServed: "ET",
        availableLanguage: ["English", "Amharic","Arabic"],
      },
    ],
  };

  const { locale } = await params;
  const messages = await getMessages({ locale });


  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${locale === "am" ? "am" : locale === "ar" ? "ar" : "en"} `}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >

      <body className={`min-h-full flex flex-col`} >
        <NextIntlClientProvider messages={messages}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />


        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster richColors position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}