import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { Paginated, ProductCategory, ProductListItem } from "@/types/cms";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { Pagination } from "@/components/ui/Pagination";
import { PageBanner } from "@/components/layout/PageBanner";

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));
  const search = sp.search ?? "";
  const category = sp.category__slug ?? "";

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  if (search) qs.set("search", search);
  if (category) qs.set("category__slug", category);

  let products: Paginated<ProductListItem> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  let categories: Paginated<ProductCategory> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  try {
    [products, categories] = await Promise.all([
      apiGet<Paginated<ProductListItem>>(`/products/?${qs.toString()}`, {
        revalidate: 120,
        tags: ["products"],
      }),
      apiGet<Paginated<ProductCategory>>(`/product-categories/`, {
        revalidate: 300,
        tags: ["product-categories"],
      }),
    ]);
  } catch (err) {
    console.error("[products] fetch failed:", err);
  }

  const totalPages = Math.max(1, Math.ceil(products.count / 20));

  return (
    <>
      <PageBanner
        eyebrow="Product Catalogue"
        title="Our Products"
        description="Explore our range of high-performance oils and lubricants for diverse industrial needs."
        image="/hero-products.jpg"
        breadcrumbs={[{ label: "Products" }]}
      />

      <div className="container-site py-10">
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