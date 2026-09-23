import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section section--hero">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>We couldn&rsquo;t find that page.</h1>
        <p className="lead">
          The page you&rsquo;re looking for may have moved or no longer exists. Try one of these
          instead.
        </p>
        <p>
          <Link className="button" href="/">
            Back to home <span aria-hidden="true">↗︎</span>
          </Link>
        </p>
        <p className="stack">
          <Link className="text-link" href="/services">
            Services
          </Link>{" "}
          <Link className="text-link" href="/about">
            About
          </Link>{" "}
          <Link className="text-link" href="/blog">
            Blog
          </Link>{" "}
          <Link className="text-link" href="/contact">
            Book a discovery call
          </Link>
        </p>
      </div>
    </section>
  );
}
