import Link from "next/link";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import { PAGE_META } from "@/lib/site";
import { CtaSection } from "@/components/CtaSection";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { TestimonialCard } from "@/components/TestimonialCard";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.home.title },
  description: PAGE_META.home.description,
  alternates: { canonical: "/" },
};

// Rebuild periodically; admin writes also trigger on-demand revalidation.
export const revalidate = 300;

const REASONS = [
  {
    h: "Get found by new customers.",
    p: "Reach prospective customers beyond your existing contacts through useful content and tested marketing channels.",
  },
  {
    h: "Give prospects confidence.",
    p: "Put clear service information and evidence of your work where prospective clients can find it.",
  },
  {
    h: "Stay in the conversation.",
    p: "Use email and customer follow-up to keep relationships going between purchases.",
  },
  {
    h: "Free up your team.",
    p: "Let Cold Open Lab manage the agreed communications work while you focus on customers and the business.",
  },
];

export default async function HomePage() {
  const [caseStudies, testimonials] = await Promise.all([
    content.caseStudies(),
    content.testimonials(),
  ]);

  return (
    <>
      <section className="section section--hero section--dark">
        <div className="container home-hero-layout">
          <div className="home-hero-copy">
            <p className="eyebrow">Brand, marketing &amp; communications</p>
            <h1>Make your business easier to find. Give customers a reason to choose it.</h1>
            <p className="lead">
              Get your brand, marketing and communications managed by one team. Cold Open Lab
              connects your messaging, website content, social media, blogs, PR and email to help
              prospective clients and customers find, trust and choose your business.
            </p>
            <Link className="button button--dark" href="/contact">
              Book a discovery call <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/services">
              Explore our services <span aria-hidden="true">↗</span>
            </Link>
            <p className="small muted">For B2B businesses and consumer and lifestyle brands.</p>
          </div>
          <div className="brand-composition" aria-hidden="true">
            <div className="orbital" />
            <div className="orbital orbital-two" />
            <div className="light-core" />
            <div className="glass-sheet sheet-back">
              <span className="sheet-index">01</span>
              <strong>Brand.</strong>
              <span className="sheet-rule" />
              <span className="sheet-rule short" />
            </div>
            <div className="glass-sheet sheet-mid">
              <span className="sheet-index">02</span>
              <strong>Marketing.</strong>
              <span className="sheet-rule" />
              <span className="sheet-rule short" />
            </div>
            <div className="glass-sheet sheet-front">
              <span className="sheet-index">03</span>
              <strong>Communications.</strong>
              <span className="sheet-rule" />
              <span className="sheet-rule short" />
            </div>
            <span className="composition-foot">ONE CONNECTED DIRECTION</span>
            <span className="composition-star">✳</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Give your marketing a job to do</p>
          <h2>Help people take the next step with your business.</h2>
          <div className="sales-grid">
            {REASONS.map((r) => (
              <article className="sales-card" key={r.h}>
                <h3>{r.h}</h3>
                <p>{r.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">How we can help</p>
          <h2>Ongoing support or one campaign. Start where you need us.</h2>
          <div className="offer-grid">
            <article className="offer-card featured">
              <p className="eyebrow">01 / Ongoing support</p>
              <h3>Your marketing and communications, managed.</h3>
              <p>
                Complete brand, marketing and communications support, including campaign strategy,
                content, PR, email and customer follow-up.
              </p>
              <p className="offer-detail">Start with 90 days. Continue as your business needs.</p>
              <Link className="text-link" href="/services#ongoing-support">
                See ongoing support <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article className="offer-card">
              <p className="eyebrow">02 / Campaign management</p>
              <h3>Give your next offer a clear route to customers.</h3>
              <p>
                Campaign strategy, content and coordination built around the action you want
                prospective customers to take.
              </p>
              <Link className="text-link" href="/services#campaigns">
                See campaign management <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article className="offer-card">
              <p className="eyebrow">03 / Event communications</p>
              <h3>Turn event interest into a conversation you can continue.</h3>
              <p>
                Communications before, during and after your event, with a plan for following up
                with leads.
              </p>
              <Link className="text-link" href="/services#events">
                See event communications <span aria-hidden="true">↗</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <p className="eyebrow">Case studies</p>
          <h2>See how the work takes shape.</h2>
          {caseStudies.length > 0 ? (
            <div className="case-grid">
              {caseStudies.slice(0, 2).map((study, i) => (
                <CaseStudyCard key={study.id} study={study} index={i} />
              ))}
            </div>
          ) : (
            <p className="muted">Case studies are on their way. Check back soon.</p>
          )}
          <p className="mt-4">
            <Link className="button button--dark" href="/contact">
              Book a discovery call <span aria-hidden="true">↗</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Testimonials</p>
          <h2>Hear about working with Cold Open Lab.</h2>
          {testimonials.length > 0 ? (
            <div className="testimonial-grid">
              {testimonials.slice(0, 2).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          ) : (
            <p className="muted">Client testimonials will appear here once approved.</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Working with Cold Open Lab</p>
          <h2>You don&rsquo;t need to build a marketing department first.</h2>
          <p>
            We handle the agreed messaging, content and coordination. You share business updates and
            available material, approve the work and respond to enquiries. If new photography or
            website development is needed, we can bring in a partner.
          </p>
          <Link className="text-link" href="/services">
            See what we handle <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <CtaSection
        heading="Give your business the marketing support it needs."
        body="Book a discovery call to discuss what you want to achieve and where Cold Open Lab can help. Share a few details, then choose a time."
      />
    </>
  );
}
