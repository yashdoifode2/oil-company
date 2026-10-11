import type { ProductListItem } from "@/types/cms";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}