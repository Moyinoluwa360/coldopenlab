import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { MailchimpPopup } from "@/components/MailchimpPopup";
import { PAGE_META, SITE_NAME, getSiteUrl } from "@/lib/site";

// Editorial display face used for blog/case-study headlines only — keeps the
// rest of the site's Arial identity intact while giving long-form content
// its own voice. Self-hosted at build time via next/font.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: PAGE_META.home.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: PAGE_META.home.description,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable}>
      <body>
        {children}
        <Analytics />
        <MailchimpPopup />
      </body>
    </html>
  );
}
