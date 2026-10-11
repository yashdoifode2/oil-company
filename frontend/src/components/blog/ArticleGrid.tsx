import type { ArticleListItem } from "@/types/cms";
import { ArticleCard } from "./ArticleCard";

export function ArticleGrid({ articles }: { articles: ArticleListItem[] }) {
  if (!articles.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>No articles published yet.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}