import type { Testimonial } from "@/lib/types";

/**
 * Testimonial display. Per the dev notes these begin as placeholders, not
 * verified endorsements — so we render NO Review/AggregateRating schema here.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card">
      <blockquote>{testimonial.quote}</blockquote>
      <p className="small">
        {testimonial.clientName}
        {testimonial.clientRole ? `, ${testimonial.clientRole}` : ""}
        {testimonial.category ? (
          <>
            <br />
            {testimonial.category}
          </>
        ) : null}
      </p>
    </article>
  );
}
