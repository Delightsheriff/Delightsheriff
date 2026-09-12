import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({subsets:['latin'],variable:'--font-heading'});

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "Full-stack and mobile software engineer based in Nigeria — chat, payments, and encrypted systems, shipped in production.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.delightsheriff.com"),
  title: {
    default: "Delight Amadi Sheriff",
    template: "%s — Delight Amadi Sheriff",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Delight Amadi Sheriff",
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: "Delight Amadi Sheriff",
  },
  twitter: {
    card: "summary",
    title: "Delight Amadi Sheriff",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", dmSans.variable, outfitHeading.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
