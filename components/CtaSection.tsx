import Link from "next/link";

/** The recurring "book a discovery call" closing section from the wireframe. */
export function CtaSection({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="section section--close">
      <div className="container">
        <h2>{heading}</h2>
        <p className="lead">{body}</p>
        <Link className="button mt-4" href="/contact">
          Book a discovery call <span aria-hidden="true">↗︎</span>
        </Link>
      </div>
    </section>
  );
}
