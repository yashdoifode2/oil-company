import Link from "next/link";
import type { ArticleListItem } from "@/types/cms";
import { mediaUrl } from "@/lib/api";
import { formatDate } from "@/lib/format";

export function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <Link href={`/blog/${article.slug}/`} className="group card hover-lift block">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--color-surface)]">
        {article.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(article.featured_image)}
            alt={article.image_alt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs mb-3">
          {article.category && (
            <span className="font-bold uppercase tracking-wide text-[var(--color-primary)]">
              {article.category.name}
            </span>
          )}
          {article.published_at && (
            <span className="text-[var(--color-muted)]">{formatDate(article.published_at)}</span>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-[var(--color-muted)] line-clamp-3">{article.excerpt}</p>
      </div>
    </Link>
  );
}