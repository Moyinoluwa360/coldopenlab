import Link from "next/link";
import type { Metadata } from "next";
import { PAGE_META } from "@/lib/site";
import { CtaSection } from "@/components/CtaSection";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.services.title },
  description: PAGE_META.services.description,
  alternates: { canonical: "/services" },
};

const CAPABILITIES = [
  {
    h: "Brand messaging",
    p: "Make what you offer clear and consistent wherever prospective customers encounter your business.",
  },
  {
    h: "Website copy",
    p: "Page structure and copy that help visitors understand your offer and enquire.",
  },
  {
    h: "Social media & content marketing",
    p: "A consistent content plan, with scripts and editing using the material available.",
  },
  {
    h: "Blogs & search content",
    p: "Useful answers to customer questions that support discovery through search and AI-assisted answers.",
  },
  {
    h: "Email marketing & customer relationships",
    p: "Communication that keeps prospects interested and customers connected after purchase.",
  },
  {
    h: "PR & external communications",
    p: "Relevant stories and communications for opportunities beyond your own pages.",
  },
];

const FAQS = [
  {
    q: "What does Cold Open Lab manage?",
    a: "Cold Open Lab provides complete brand, marketing and communications support. This includes brand messaging, campaign strategy, website copy, social media, content, blogs, PR, email marketing and customer follow-up, planned together around your business goals.",
  },
  {
    q: "Who does Cold Open Lab work with?",
    a: "Cold Open Lab works with B2B businesses and consumer and lifestyle brands, including businesses building their online presence and teams that need help coordinating their marketing.",
  },
  {
    q: "What will our team need to do?",
    a: "Share business updates and available material, approve content and respond to customer enquiries. Cold Open Lab manages the agreed communications work.",
  },
  {
    q: "What if we need photos, videos or a website?",
    a: "We can work with material you already have, guide your team on what to capture, or bring in a production partner. Cold Open Lab handles scripts and editing. For websites, we handle the copy and structure, then work with your developer or a Cold Open Lab partner.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Yes. We agree who handles each part of the work and coordinate with your team and relevant suppliers.",
  },
  {
    q: "What happens after 90 days?",
    a: "We review the work and the response, then agree how the engagement can continue around your business needs.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="section section--hero section--dark">
        <div className="container">
          <p className="eyebrow">Our services</p>
          <h1>Brand, marketing and communications services that work together.</h1>
          <p className="lead">
            Bring your brand messaging, content and customer communications together with one team.
            We also manage individual campaigns and event communications.
          </p>
          <p>
            <Link className="button button--dark" href="/contact">
              Book a discovery call <span aria-hidden="true">↗︎</span>
            </Link>
          </p>
          <div className="service-jump">
            <a href="#ongoing-support">Ongoing support</a>
            <a href="#campaigns">Campaign management</a>
            <a href="#events">Event communications</a>
          </div>
        </div>
      </section>

      <section className="section" id="ongoing-support">
        <div className="container">
          <p className="eyebrow">01 / Ongoing support</p>
          <h2>Your external marketing and communications team.</h2>
          <p>
            Get complete brand, marketing and communications support in one engagement. Brand
            messaging, campaign strategy, website copy, social media, blogs, PR, email and customer
            marketing work together around your business goals. Start with 90 days, with the option
            to continue.
          </p>
          <div className="sales-grid">
            {CAPABILITIES.map((c) => (
              <article className="sales-card" key={c.h}>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </article>
            ))}
          </div>
          <div className="scope-strip">
            <h3>Test new ways to reach customers.</h3>
            <p>
              During the first 90 days, we test at least three marketing channels and use the
              response to guide where your business should focus next.
            </p>
          </div>
          <p>
            <Link className="button" href="/contact">
              Book a discovery call <span aria-hidden="true">↗︎</span>
            </Link>
          </p>
          <p className="small muted">
            We agree priorities, timelines and delivery arrangements before work begins.
          </p>
        </div>
      </section>

      <section className="section" id="campaigns">
        <div className="container">
          <p className="eyebrow">02 / Campaign management</p>
          <h2>Give your campaign a clear goal and a team to deliver it.</h2>
          <p>
            Promoting an offer or planning a launch? We connect the message, content and agreed
            channels around what you want prospective customers to do.
          </p>
          <div className="sales-grid three-up">
            <article className="sales-card">
              <h3>Strategy &amp; messaging</h3>
              <p>Define the audience, offer and action the campaign needs to support.</p>
            </article>
            <article className="sales-card">
              <h3>Content &amp; coordination</h3>
              <p>Prepare the campaign material and manage delivery across the agreed channels.</p>
            </article>
            <article className="sales-card">
              <h3>Review &amp; follow-up</h3>
              <p>
                Use the response to adjust the campaign and continue the conversation with
                interested prospects.
              </p>
            </article>
          </div>
          <p>
            <Link className="button" href="/contact">
              Book a discovery call <span aria-hidden="true">↗︎</span>
            </Link>
          </p>
          <p className="small muted">Available as an individual project.</p>
        </div>
      </section>

      <section className="section" id="events">
        <div className="container">
          <p className="eyebrow">03 / Event communications</p>
          <h2>Keep your event working after everyone goes home.</h2>
          <p>
            Build interest before the event and give attendees a reason to stay connected
            afterwards. We plan the follow-up while the event is still taking shape.
          </p>
          <div className="sales-grid three-up">
            <article className="sales-card">
              <h3>Before</h3>
              <p>Give prospective attendees a reason to attend and the information they need to take part.</p>
            </article>
            <article className="sales-card">
              <h3>During</h3>
              <p>Keep communications consistent and introduce a clear next step.</p>
            </article>
            <article className="sales-card">
              <h3>After</h3>
              <p>Follow up with a campaign connected to the event and the interest it creates.</p>
            </article>
          </div>
          <p>
            <Link className="button" href="/contact">
              Book a discovery call <span aria-hidden="true">↗︎</span>
            </Link>
          </p>
          <p className="small muted">Available as an individual project.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>A few things worth knowing before we talk.</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        heading="Let’s put the right support in place."
        body="Tell us what you’re working towards. We’ll discuss the scope, fees and next steps on a discovery call."
      />
    </>
  );
}
