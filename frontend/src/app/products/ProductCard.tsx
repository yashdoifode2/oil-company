import Link from "next/link";
import type { ProductListItem } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      href={`/products/${product.slug}/`}
      className="group block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.main_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(product.main_image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        {product.category && (
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: "var(--color-primary)" }}>
            {product.category.name}
          </div>
        )}
        <h3 className="font-semibold text-lg mb-2 group-hover:underline">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.short_description}</p>
      </div>
    </Link>
  );
}