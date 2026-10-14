import type { Metadata } from "next";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { Paginated, ProductCategory, ProductListItem } from "@/types/cms";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Products",
  description: "Certified industrial, automotive, and edible oils for every application.",
};

type SearchParams = Promise<{
  page?: string;
  search?: string;
  category__slug?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));
  const search = sp.search ?? "";
  const category = sp.category__slug ?? "";

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  if (search) qs.set("search", search);
  if (category) qs.set("category__slug", category);

  let products: Paginated<ProductListItem> = { count: 0, next: null, previous: null, results: [] };
  let categories: Paginated<ProductCategory> = { count: 0, next: null, previous: null, results: [] };

  try {
    [products, categories] = await Promise.all([
      apiGet<Paginated<ProductListItem>>(`/products/?${qs.toString()}`, { revalidate: 120, tags: ["products"] }),
      apiGet<Paginated<ProductCategory>>(`/product-categories/`, { revalidate: 300, tags: ["product-categories"] }),
    ]);
  } catch (err) {
    console.error("[products] fetch failed:", err);
  }

  const totalPages = Math.max(1, Math.ceil(products.count / 20));

  return (
    <>
      {/* Page banner */}
      <section className="relative overflow-hidden">
  <div className="absolute inset-0">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/hero-products.jpg"
      alt=""
      className="w-full h-full object-cover"
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(100deg, rgba(11,61,145,0.94) 0%, rgba(11,61,145,0.72) 60%, rgba(11,61,145,0.45) 100%)",
      }}
    />
  </div>
  <div className="container-site relative py-20 md:py-24 text-white">
    <p
      className="text-xs uppercase tracking-[0.18em] font-bold mb-3"
      style={{ color: "var(--color-secondary)" }}
    >
      Product Catalogue
    </p>
    <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Products</h1>
    <p className="text-lg text-white/85 max-w-2xl">
      Explore our range of high-performance oils and lubricants for diverse industrial needs.
    </p>
  </div>
</section>

      <div className="container-site py-10">
        <Breadcrumbs items={[{ label: "Products" }]} />

        <CategoryTabs categories={categories.results} current={category} />

        <ProductFilters
          categories={categories.results}
          currentCategory={category}
          currentSearch={search}
        />

        <ProductGrid products={products.results} />

        <Pagination
          current={page}
          total={totalPages}
          basePath="/products"
          query={{ search, category__slug: category }}
        />
      </div>
    </>
  );
}