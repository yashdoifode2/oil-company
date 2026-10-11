import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";
import type {
  ArticleListItem,
  Industry,
  Paginated,
  ProductListItem,
  PageListItem,
} from "@/types/cms";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/faqs`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const fetchAll = async <T,>(path: string): Promise<T[]> => {
    try {
      const res = await apiGet<Paginated<T>>(path, { revalidate: 3600, tags: ["sitemap"] });
      return res.results;
    } catch {
      return [];
    }
  };

  const [products, articles, industries, pages] = await Promise.all([
    fetchAll<ProductListItem>("/products/?page_size=500"),
    fetchAll<ArticleListItem>("/articles/?page_size=500"),
    fetchAll<Industry>("/industries/?page_size=200"),
    fetchAll<PageListItem>("/pages/?page_size=200"),
  ]);

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${SITE}/products/${p.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${SITE}/blog/${a.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...industries.map((i) => ({
      url: `${SITE}/industries/${i.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...pages.map((p) => ({
      url: `${SITE}/${p.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}