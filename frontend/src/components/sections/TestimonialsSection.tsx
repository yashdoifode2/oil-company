import type { HomepageSection, Testimonial, Paginated } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";

export async function TestimonialsSection({ section }: { section: HomepageSection }) {
  const limit = (section.config?.limit as number | undefined) ?? 3;
  let testimonials: Testimonial[] = [];
  try {
    const res = await apiGet<Paginated<Testimonial>>(`/testimonials/?page_size=${limit}`, { revalidate: 300, tags: ["testimonials"] });
    testimonials = res.results;
  } catch { /* ignore */ }

  if (!testimonials.length) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container-site">
        {section.heading && <h2 className="text-3xl font-bold mb-10 text-center">{section.heading}</h2>}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <p className="italic text-gray-700 mb-4">“{t.text}”</p>
              <footer className="flex items-center gap-3">
                {t.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(t.image)} alt={t.customer_name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <div className="font-semibold text-sm">{t.customer_name}</div>
                  {t.company && <div className="text-xs text-gray-500">{t.company}</div>}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}