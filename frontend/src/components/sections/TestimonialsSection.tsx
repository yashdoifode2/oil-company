import type { HomepageSection, Testimonial, Paginated } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";

export async function TestimonialsSection({
  section,
}: {
  section: HomepageSection;
}) {
  const limit = (section.config?.limit as number | undefined) ?? 3;
  let testimonials: Testimonial[] = [];
  try {
    const res = await apiGet<Paginated<Testimonial>>(
      `/testimonials/?page_size=${limit}`,
      { revalidate: 300, tags: ["testimonials"] }
    );
    testimonials = res.results;
  } catch {
    /* ignore */
  }

  if (!testimonials.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title">
            {section.heading || "What our clients say"}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="relative bg-[var(--color-surface)] rounded-lg p-8 border border-[var(--color-border)]"
            >
              <svg
                className="absolute top-6 right-6 opacity-15"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="var(--color-primary)"
              >
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>

              <blockquote className="text-[var(--color-muted)] italic mb-6 leading-relaxed">
                "{t.text}"
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-5 border-t border-[var(--color-border)]">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(t.image)}
                    alt={t.customer_name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm"
                    style={{
                      background: "rgba(11,61,145,0.1)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {t.customer_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm text-[var(--color-text)]">
                    {t.customer_name}
                  </div>
                  {t.company && (
                    <div className="text-xs text-[var(--color-muted)]">
                      {t.company}
                    </div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}