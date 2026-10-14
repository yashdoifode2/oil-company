"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ProductCategory } from "@/types/cms";

export function CategoryTabs({
  categories,
  current,
}: {
  categories: ProductCategory[];
  current: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category__slug", slug);
    else params.delete("category__slug");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const tabs = [{ slug: "", name: "All Products" }, ...categories];

  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b pb-1">
      {tabs.map((t) => {
        const active = t.slug === current;
        return (
          <button
            key={t.slug}
            onClick={() => navigate(t.slug)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors border-b-2 -mb-[2px] ${
              active
                ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                : "text-[var(--color-muted)] border-transparent hover:text-[var(--color-primary)]"
            }`}
          >
            {t.name}
          </button>
        );
      })}
    </div>
  );
}