import Link from "next/link";
import type { HomepageSection, Paginated, ProductListItem } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";

export async function FeaturedProductsSection({ section }: { section: HomepageSection }) {
  const limit = (section.config?.limit as number | undefined) ?? 6;
  const mode = (section.config?.mode as string | undefined) ?? "auto";
  const ids = (section.config?.product_ids as number[] | undefined) ?? [];

  let products: ProductListItem[] = [];
  try {
    const qs = new URLSearchParams();
    qs.set("page_size", String(limit));
    if (mode === "auto") qs.set("is_featured", "true");
    const res = await apiGet<Paginated<ProductListItem>>(`/products/?${qs.toString()}`, {
      revalidate: 120,
      tags: ["products"],
    });
    products = res.results;
    if (mode === "manual" && ids.length) {
      products = ids
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as ProductListItem[];
    }
  } catch { /* ignore */ }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container-site">
        {section.heading && <h2 className="text-3xl font-bold mb-3">{section.heading}</h2>}
        {section.description && <p className="text-gray-600 mb-10 max-w-2xl">{section.description}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}/`}
              className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                {p.main_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(p.main_image)}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}
              </div>
              <div className="p-5">
                {p.category && (
                  <div className="text-xs uppercase font-semibold mb-2" style={{ color: "var(--color-primary)" }}>
                    {p.category.name}
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2 group-hover:underline">{p.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.short_description}</p>
                <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                  Request a Quote →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View-all button under the grid */}
        <div className="text-center mt-12">
          <Link
            href={section.button_url || "/products"}
            className="inline-flex items-center justify-center px-7 py-3 rounded font-semibold"
            style={{ background: "var(--color-button)", color: "var(--color-button-text)" }}
          >
            {section.button_text || "View All Products"}
          </Link>
        </div>
      </div>
    </section>
  );
}