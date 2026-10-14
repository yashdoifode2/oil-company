import type { Metadata } from "next";
import Link from "next/link";
import { apiGet, mediaUrl } from "@/lib/api";
import type { ArticleListItem, Paginated } from "@/types/cms";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import { PageBanner } from "@/components/layout/PageBanner";
import { formatDate } from "@/lib/format";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Insights & Blog",
  description: "Industry insights, technical guides, and product news.",
};

type SearchParams = Promise<{ page?: string }>;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));

  let articles: Paginated<ArticleListItem> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  try {
    articles = await apiGet<Paginated<ArticleListItem>>(
      `/articles/?page=${page}`,
      { revalidate: 120, tags: ["articles"] }
    );
  } catch (err) {
    console.error("[blog] fetch failed:", err);
  }

  const [featured, ...rest] = articles.results;
  const totalPages = Math.max(1, Math.ceil(articles.count / 20));

  return (
    <>
      <PageBanner
        bannerKey="blog"
        breadcrumbs={[{ label: "Blog" }]}
      />

      <div className="container-site py-12">
        {featured && (
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Link
              href={`/blog/${featured.slug}/`}
              className="lg:col-span-2 group card hover-lift block overflow-hidden"
            >
              <div className="aspect-[16/9] bg-[var(--color-surface)] overflow-hidden">
                {featured.featured_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(featured.featured_image)}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : null}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs uppercase tracking-wide font-bold text-[var(--color-secondary)] px-2 py-1 rounded bg-[var(--color-secondary)]/10">
                    Featured
                  </span>
                  {featured.published_at && (
                    <span className="text-xs text-[var(--color-muted)]">
                      {formatDate(featured.published_at)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[var(--color-muted)] mb-4 line-clamp-3">
                  {featured.excerpt}
                </p>
                <span className="font-semibold text-[var(--color-primary)] text-sm">
                  Read article →
                </span>
              </div>
            </Link>

            <aside className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="font-bold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                {["Lubrication", "Industry News", "Technical", "Company Updates"].map(
                  (c) => (
                    <li key={c}>
                      <span className="text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer">
                        {c}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </aside>
          </div>
        )}

        {rest.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}

        <Pagination current={page} total={totalPages} basePath="/blog" />
      </div>
    </>
  );
}