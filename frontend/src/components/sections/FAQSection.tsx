import type { HomepageSection, FAQ, Paginated } from "@/types/cms";
import { apiGet } from "@/lib/api";

export async function FAQSection({ section }: { section: HomepageSection }) {
  const limit = (section.config?.limit as number | undefined) ?? 5;
  let faqs: FAQ[] = [];
  try {
    const res = await apiGet<Paginated<FAQ>>(`/faqs/?page_size=${limit}`, { revalidate: 300, tags: ["faqs"] });
    faqs = res.results;
  } catch { /* ignore */ }

  if (!faqs.length) return null;

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container-site max-w-3xl">
        {section.heading && <h2 className="text-3xl font-bold mb-8 text-center">{section.heading}</h2>}
        <div className="divide-y border rounded-lg bg-white">
          {faqs.map((f) => (
            <details key={f.id} className="group p-5">
              <summary className="cursor-pointer font-semibold flex items-center justify-between">
                {f.question}
                <span className="group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-gray-600">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}