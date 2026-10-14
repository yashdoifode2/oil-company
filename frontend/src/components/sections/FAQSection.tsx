import type { HomepageSection, FAQ, Paginated } from "@/types/cms";
import { apiGet } from "@/lib/api";

export async function FAQSection({ section }: { section: HomepageSection }) {
  const limit = (section.config?.limit as number | undefined) ?? 5;
  let faqs: FAQ[] = [];
  try {
    const res = await apiGet<Paginated<FAQ>>(`/faqs/?page_size=${limit}`, {
      revalidate: 300,
      tags: ["faqs"],
    });
    faqs = res.results;
  } catch {
    /* ignore */
  }

  if (!faqs.length) return null;

  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="container-site max-w-3xl">
        <div className="text-center mb-12">
          <span className="section-eyebrow">FAQs</span>
          <h2 className="section-title">
            {section.heading || "Frequently asked questions"}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.id}
              className="group bg-white rounded-lg border border-[var(--color-border)] open:shadow-md transition-shadow"
            >
              <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4 font-semibold text-[var(--color-text)]">
                {f.question}
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-lg leading-none group-open:rotate-45 transition-transform"
                  style={{
                    background: "rgba(11,61,145,0.08)",
                    color: "var(--color-primary)",
                  }}
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 pt-0 text-[var(--color-muted)] leading-relaxed">
                {f.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}