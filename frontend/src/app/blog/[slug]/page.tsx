import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet, mediaUrl } from "@/lib/api";
import type { ArticleDetail, ArticleListItem, Paginated } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { ArticleCard } from "@/components/blog/ArticleCard";
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
    const res = await apiGet<Paginated<ArticleListItem>>(`/articles/?page_size=4`, {
      revalidate: 300,
      tags: ["articles"],
    });
    related = res.results.filter((a) => a.id !== article.id).slice(0, 3);
  } catch {
    /* ignore */
  }

  return (
    <div className="container-site py-12">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />
      <article className="max-w-3xl mx-auto">
        {article.category && (
          <Link
            href={`/blog?category__slug=${article.category.slug}`}
            className="text-xs uppercase tracking-wide font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-5">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 pb-6 border-b">
          {article.author_name && <span>By {article.author_name}</span>}
          {article.published_at && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
            </>
          )}
        </div>
        {article.featured_image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8 bg-gray-100">
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
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>
      {related.length > 0 && (
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">More from the blog</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}