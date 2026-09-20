import type { Metadata } from "next";
import { content } from "@/lib/content";
import { PAGE_META } from "@/lib/site";
import { CtaSection } from "@/components/CtaSection";
import { TeamGrid } from "@/components/TeamGrid";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.about.title },
  description: PAGE_META.about.description,
  alternates: { canonical: "/about" },
};

export const revalidate = 300;

export default async function AboutPage() {
  const team = await content.team();

  return (
    <>
      <section className="section section--hero section--dark">
        <div className="container">
          <p className="eyebrow">About Cold Open Lab</p>
          <h1>Your next client should be able to see what makes you worth choosing.</h1>
          <p className="lead">
            We help B2B businesses and consumer and lifestyle brands make their value clear through
            the way they show up and communicate.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Built to bring the whole picture together.</h2>
          <p>
            Cold Open Lab brings brand messaging, content and campaign delivery into one coordinated
            plan. We get to know your business, decide what your audience needs to hear and manage
            the agreed work across channels.
          </p>
          <p>
            For your team, it means having a marketing and communications team who understand the
            business and take responsibility for moving its communications forward.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Meet the Icebreakers</h2>
          <p>
            The team getting to know your business, shaping the content and checking the work
            before it reaches your audience.
          </p>
          <TeamGrid members={team} />
        </div>
      </section>

      <CtaSection
        heading="Get a team that gets to know your business."
        body="Book a discovery call with Cold Open Lab to discuss what you need and how we can work together."
      />
    </>
  );
}
