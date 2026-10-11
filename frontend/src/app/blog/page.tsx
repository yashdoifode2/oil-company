import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { ArticleListItem, Paginated } from "@/types/cms";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Blog",
  description: "Industry insights, product news, and technical guides.",
};

type SearchParams = Promise<{ page?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));

  let articles: Paginated<ArticleListItem> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  try {
    articles = await apiGet<Paginated<ArticleListItem>>(`/articles/?page=${page}`, {
      revalidate: 120,
      tags: ["articles"],
    });
  } catch (err) {
    console.error("[blog] fetch failed:", err);
  }

  const totalPages = Math.max(1, Math.ceil(articles.count / 20));

  return (
    <div className="container-site py-12">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Blog</h1>
        <p className="text-gray-600 max-w-2xl">
          Industry insights, technical guides, and product news from our team.
        </p>
      </div>
      <ArticleGrid articles={articles.results} />
      <Pagination current={page} total={totalPages} basePath="/blog" />
    </div>
  );
}