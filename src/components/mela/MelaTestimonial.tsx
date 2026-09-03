"use client";

import { useMela } from "@/lib/mela/MelaLocaleProvider";

export function MelaTestimonial() {
  const { c } = useMela();
  return (
    <section id="testimonio">
      <div className="wrap quote-block">
        <p className="eyebrow">{c.testimonial.eyebrow}</p>
        <blockquote>{c.testimonial.quote}</blockquote>
        <p className="cite">{c.testimonial.cite}</p>
      </div>
    </section>
  );
}
