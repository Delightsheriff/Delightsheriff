import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSiteSettings, getWorkEntries } from "@/sanity/queries";
import { Analytics } from "@vercel/analytics/next";
import { HOME_DESCRIPTION, HOME_TITLE, LLMS_TYPES, SEO_KEYWORDS, SITE_NAME, SITE_URL, buildSiteGraph, jsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Optional: set these in the hosting environment after adding the site to Google Search Console
// and Bing Webmaster Tools. They add the verification meta tags only when present.
const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;
const BING_VERIFICATION = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: {
    canonical: "/",
    types: LLMS_TYPES,
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
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    creator: "@delightsheriff",
    site: "@delightsheriff",
  },
  verification: {
    ...(GOOGLE_VERIFICATION && { google: GOOGLE_VERIFICATION }),
    ...(BING_VERIFICATION && { other: { "msvalidate.01": BING_VERIFICATION } }),
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, work] = await Promise.all([getSiteSettings(), getWorkEntries()]);

  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "font-sans", geistSans.variable, geistMono.variable)}
    >
      <head>
        {/* Tells AI agents where this domain publishes its resources (ARD). */}
        <link rel="ard" href="/.well-known/ard.json" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(buildSiteGraph({ settings, work })) }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
