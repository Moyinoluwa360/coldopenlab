import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { MailchimpPopup } from "@/components/MailchimpPopup";
import { PAGE_META, SITE_NAME, getSiteUrl } from "@/lib/site";

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
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <MailchimpPopup />
      </body>
    </html>
  );
}
