import Link from "next/link";
import type { ArticleListItem } from "@/types/cms";
import { mediaUrl } from "@/lib/api";
import { formatDate } from "@/lib/format";

export function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <Link href={`/blog/${article.slug}/`} className="group block">
      {article.featured_image && (
        <div className="aspect-video overflow-hidden rounded-lg bg-gray-100 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(article.featured_image)}
            alt={article.image_alt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      )}
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
        {article.category && (
          <span className="font-semibold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>
            {article.category.name}
          </span>
        )}
        {article.published_at && <span>{formatDate(article.published_at)}</span>}
      </div>
      <h3 className="font-semibold text-lg mb-2 group-hover:underline">{article.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
    </Link>
  );
}