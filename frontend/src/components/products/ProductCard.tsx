import Link from "next/link";
import type { ProductListItem } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link href={`/products/${product.slug}/`} className="group card hover-lift block">
      <div className="aspect-[4/3] bg-[var(--color-surface)] overflow-hidden">
        {product.main_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(product.main_image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        {product.category && (
          <div className="text-xs uppercase font-bold tracking-wide mb-2 text-[var(--color-primary)]">
            {product.category.name}
          </div>
        )}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-4">
          {product.short_description}
        </p>
        <span className="text-sm font-semibold inline-flex items-center gap-1 text-[var(--color-primary)]">
          View details →
        </span>
      </div>
    </Link>
  );
}