import type { Metadata } from "next";
import { PAGE_META } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.contact.title },
  description: PAGE_META.contact.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="section section--hero">
        <div className="container">
          <p className="eyebrow">Book a discovery call</p>
          <h1>Tell us what is happening in your business.</h1>
          <p className="lead">
            Share a few details about your business and the support you need. Once you submit the
            form, you can choose a discovery-call time that works for you.
          </p>
          <p>
            We&rsquo;ll discuss your current communications, the clients or customers you want to
            reach and where Cold Open Lab could help.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
