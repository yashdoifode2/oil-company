import Link from "next/link";
import type { HomepageSection, ArticleListItem, Paginated } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";
import { formatDate } from "@/lib/format";

export async function LatestArticlesSection({
  section,
}: {
  section: HomepageSection;
}) {
  const limit = (section.config?.limit as number | undefined) ?? 3;
  let articles: ArticleListItem[] = [];
  try {
    const res = await apiGet<Paginated<ArticleListItem>>(
      `/articles/?page_size=${limit}`,
      { revalidate: 120, tags: ["articles"] }
    );
    articles = res.results;
  } catch {
    /* ignore */
  }

  if (!articles.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div className="max-w-2xl">
            <span className="section-eyebrow">Latest Insights</span>
            <h2 className="section-title">
              {section.heading || "From our blog"}
            </h2>
            {section.description && (
              <p className="section-subtitle">{section.description}</p>
            )}
          </div>
          <Link
            href={section.button_url || "/blog"}
            className="btn btn-outline shrink-0"
          >
            {section.button_text || "View All Articles"} →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}/`}
              className="group card hover-lift block"
            >
              <div className="aspect-[16/10] bg-[var(--color-surface)] overflow-hidden">
                {a.featured_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(a.featured_image)}
                    alt={a.image_alt || a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs mb-3">
                  {a.category && (
                    <span
                      className="font-bold uppercase tracking-wider"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {a.category.name}
                    </span>
                  )}
                  {a.published_at && (
                    <span className="text-[var(--color-muted)]">
                      {formatDate(a.published_at)}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                  {a.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] line-clamp-3">
                  {a.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}