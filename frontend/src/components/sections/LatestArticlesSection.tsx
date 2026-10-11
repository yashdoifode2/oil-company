import Link from "next/link";
import type { HomepageSection, ArticleListItem, Paginated } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";

export async function LatestArticlesSection({ section }: { section: HomepageSection }) {
  const limit = (section.config?.limit as number | undefined) ?? 3;
  let articles: ArticleListItem[] = [];
  try {
    const res = await apiGet<Paginated<ArticleListItem>>(`/articles/?page_size=${limit}`, { revalidate: 120, tags: ["articles"] });
    articles = res.results;
  } catch { /* ignore */ }

  if (!articles.length) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container-site">
        {section.heading && <h2 className="text-3xl font-bold mb-3">{section.heading}</h2>}
        {section.description && <p className="text-gray-600 mb-10 max-w-2xl">{section.description}</p>}
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link key={a.id} href={`/blog/${a.slug}/`} className="group block">
              {a.featured_image && (
                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(a.featured_image)} alt={a.image_alt || a.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2 group-hover:underline">{a.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{a.excerpt}</p>
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