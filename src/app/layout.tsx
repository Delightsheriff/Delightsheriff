import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/sanity/queries";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Runs before first paint. Midnight is the default; Paper only when the visitor chose it.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light")}catch(e){}})()`;

const SITE_DESCRIPTION =
  "Full-stack and mobile software engineer based in Nigeria, building chat, payments, and encrypted systems, shipped in production.";

const SITE_URL = "https://www.delightsheriff.com";
const SITE_KEYWORDS = [
  "Delight Amadi Sheriff",
  "software engineer",
  "full-stack developer",
  "mobile developer",
  "React Native developer",
  "Next.js developer Nigeria",
  "Node.js developer",
  "software engineer Nigeria",
  "TypeScript developer",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Delight Amadi Sheriff — Full-Stack Software Engineer",
    template: "%s — Delight Amadi Sheriff",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "Delight Amadi Sheriff", url: SITE_URL }],
  creator: "Delight Amadi Sheriff",
  publisher: "Delight Amadi Sheriff",
  category: "technology",
  alternates: { canonical: "/" },
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
    title: "Delight Amadi Sheriff — Full-Stack Software Engineer",
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Delight Amadi Sheriff",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delight Amadi Sheriff — Full-Stack Software Engineer",
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  const sameAs = [settings?.githubUrl, settings?.linkedinUrl].filter(
    (url): url is string => Boolean(url),
  );

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Delight Amadi Sheriff",
    url: SITE_URL,
    jobTitle: settings?.heroTitle ?? "Software Engineer",
    description: SITE_DESCRIPTION,
    ...(settings?.email && { email: `mailto:${settings.email}` }),
    ...(sameAs.length > 0 && { sameAs }),
    knowsAbout: [
      "Full-Stack Development",
      "Mobile Development",
      "React Native",
      "Next.js",
      "TypeScript",
      "Node.js",
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark", "h-full", "font-sans", geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
