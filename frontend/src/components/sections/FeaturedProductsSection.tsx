import Link from "next/link";
import type { HomepageSection, Paginated, ProductListItem } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";

export async function FeaturedProductsSection({
  section,
}: {
  section: HomepageSection;
}) {
  const limit = (section.config?.limit as number | undefined) ?? 6;
  const mode = (section.config?.mode as string | undefined) ?? "auto";
  const ids = (section.config?.product_ids as number[] | undefined) ?? [];

  let products: ProductListItem[] = [];
  try {
    const qs = new URLSearchParams();
    qs.set("page_size", String(limit));
    if (mode === "auto") qs.set("is_featured", "true");
    const res = await apiGet<Paginated<ProductListItem>>(
      `/products/?${qs.toString()}`,
      { revalidate: 120, tags: ["products"] }
    );
    products = res.results;
    if (mode === "manual" && ids.length) {
      products = ids
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as ProductListItem[];
    }
  } catch {
    /* ignore */
  }

  if (!products.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div className="max-w-2xl">
            <span className="section-eyebrow">Our Product Range</span>
            <h2 className="section-title">
              {section.heading || "Quality oils engineered for performance"}
            </h2>
            {section.description && (
              <p className="section-subtitle">{section.description}</p>
            )}
          </div>
          <Link
            href={section.button_url || "/products"}
            className="btn btn-outline shrink-0"
          >
            {section.button_text || "View All Products"} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}/`}
              className="group card hover-lift block"
            >
              <div className="aspect-[4/3] bg-[var(--color-surface)] overflow-hidden">
                {p.main_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(p.main_image)}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-6">
                {p.category && (
                  <div
                    className="text-xs uppercase font-bold tracking-wider mb-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {p.category.name}
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                  {p.name}
                </h3>
                <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-5">
                  {p.short_description}
                </p>
                <span
                  className="text-sm font-semibold inline-flex items-center gap-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  View details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}