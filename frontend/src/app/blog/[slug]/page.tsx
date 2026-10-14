import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet, mediaUrl } from "@/lib/api";
import type { ArticleDetail, ArticleListItem, Paginated } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { formatDate } from "@/lib/format";

export const revalidate = 120;

type Params = Promise<{ slug: string }>;

async function loadArticle(slug: string): Promise<ArticleDetail | null> {
  try {
    return await apiGet<ArticleDetail>(`/articles/${slug}/`, {
      revalidate: 120,
      tags: [`article:${slug}`, "articles"],
    });
  } catch (err) {
    console.error(`[article:${slug}] load failed:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = await loadArticle(slug);
  if (!a) return { title: "Article not found" };
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: a.featured_image ? { images: [mediaUrl(a.featured_image)] } : undefined,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  let related: ArticleListItem[] = [];
  try {
    const res = await apiGet<Paginated<ArticleListItem>>(`/articles/?page_size=6`, {
      revalidate: 300,
      tags: ["articles"],
    });
    related = res.results.filter((a) => a.id !== article.id).slice(0, 3);
  } catch {
    /* ignore */
  }

  return (
    <>
      <section
        className="py-16 md:py-20"
        style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, #082b6a 100%)" }}
      >
        <div className="container-site text-white">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />
          {article.category && (
            <div
              className="text-xs uppercase tracking-wider font-bold mb-3"
              style={{ color: "var(--color-secondary)" }}
            >
              {article.category.name}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/80">
            {article.author_name && <span>By {article.author_name}</span>}
            {article.published_at && (
              <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
            )}
          </div>
        </div>
      </section>

      <article className="container-site py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div>
            {article.featured_image && (
              <div className="aspect-video overflow-hidden rounded-lg mb-10 bg-[var(--color-surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(article.featured_image)}
                  alt={article.image_alt || article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <RichText html={article.body} />
            {article.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-[var(--color-surface)] px-3 py-1 rounded-full text-[var(--color-muted)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="font-bold text-sm uppercase tracking-wide mb-4">Need help?</h3>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                Talk to our technical team to find the right oil for your application.
              </p>
              <Link href="/contact" className="btn btn-primary w-full text-sm">
                Contact our team
              </Link>
            </div>

            {related.length > 0 && (
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {related.map((a) => (
                    <Link key={a.id} href={`/blog/${a.slug}/`} className="flex gap-3 group">
                      {a.featured_image && (
                        <div className="w-20 h-20 shrink-0 rounded overflow-hidden bg-[var(--color-surface)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mediaUrl(a.featured_image)}
                            alt={a.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold group-hover:text-[var(--color-primary)] line-clamp-2 mb-1">
                          {a.title}
                        </h4>
                        {a.published_at && (
                          <div className="text-xs text-[var(--color-muted)]">
                            {formatDate(a.published_at)}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  );
}