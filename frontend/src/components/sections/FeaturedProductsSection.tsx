import Link from "next/link";
import type { HomepageSection, ProductListItem, Paginated } from "@/types/cms";
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
    const res = await apiGet<Paginated<ProductListItem>>(`/products/?${qs.toString()}`, { revalidate: 120, tags: ["products"] });
    products = res.results;
    if (mode === "manual" && ids.length) {
      products = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as ProductListItem[];
    }
  } catch { /* render empty */ }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container-site">
        {section.heading && <h2 className="text-3xl font-bold mb-3">{section.heading}</h2>}
        {section.description && <p className="text-gray-600 mb-10 max-w-2xl">{section.description}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}/`} className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                {p.main_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(p.main_image)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : null}
              </div>
              <div className="p-5">
                {p.category && <div className="text-xs uppercase font-semibold mb-2" style={{ color: "var(--color-primary)" }}>{p.category.name}</div>}
                <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{p.short_description}</p>
              </div>
            </Link>
          ))}
        </div>

        {section.button_text && section.button_url && (
          <div className="text-center mt-10">
            <Link href={section.button_url} className="btn btn-primary">{section.button_text}</Link>
          </div>
        )}
      </div>
    </section>
  );
}