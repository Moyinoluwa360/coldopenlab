import type { Metadata } from "next";
import { PAGE_META } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.privacy.title },
  description: PAGE_META.privacy.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section section--hero">
      <div className="container">
        <p className="eyebrow">Privacy notice</p>
        <h1>Privacy notice coming soon.</h1>
        {/* TODO: client to provide — approved privacy-notice text. */}
        <div className="empty-state">
          <p>
            Cold Open Lab&rsquo;s full privacy notice is being finalised and will be published here
            before launch. It will explain what information we collect when you contact us, how we
            use it and how to get in touch about your data.
          </p>
        </div>
      </div>
    </section>
  );
}
