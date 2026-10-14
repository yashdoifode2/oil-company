import Link from "next/link";
import type { HomepageSection, Industry, Paginated } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";

export async function IndustriesSection({
  section,
}: {
  section: HomepageSection;
}) {
  const limit = (section.config?.limit as number | undefined) ?? 6;
  let industries: Industry[] = [];
  try {
    const res = await apiGet<Paginated<Industry>>(
      `/industries/?page_size=${limit}`,
      { revalidate: 300, tags: ["industries"] }
    );
    industries = res.results;
  } catch {
    /* ignore */
  }

  if (!industries.length) return null;

  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="container-site">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="section-eyebrow">Industries We Serve</span>
          <h2 className="section-title">
            {section.heading || "Solutions for every industry"}
          </h2>
          {section.description && (
            <p className="section-subtitle mx-auto">{section.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((ind) => (
            <Link
              key={ind.id}
              href={`/industries/${ind.slug}/`}
              className="group flex flex-col items-center text-center p-5 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              {ind.featured_image ? (
                <div className="w-16 h-16 mb-3 rounded-lg overflow-hidden bg-[var(--color-surface)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(ind.featured_image)}
                    alt={ind.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-16 h-16 mb-3 rounded-lg flex items-center justify-center text-2xl font-bold"
                  style={{
                    background: "rgba(11,61,145,0.08)",
                    color: "var(--color-primary)",
                  }}
                >
                  {ind.name.charAt(0)}
                </div>
              )}
              <span className="font-medium text-sm group-hover:text-[var(--color-primary)] transition-colors">
                {ind.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}