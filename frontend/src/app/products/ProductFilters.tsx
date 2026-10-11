"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ProductCategory } from "@/types/cms";
import { useState } from "react";

export function ProductFilters({
  categories,
  currentCategory,
  currentSearch,
}: {
  categories: ProductCategory[];
  currentCategory: string;
  currentSearch: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(currentSearch);

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-end mb-8">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1.5">Search</label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update("search", q);
          }}
        >
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2"
            style={{ borderColor: "#ddd" }}
          />
        </form>
      </div>
      <div className="md:w-64">
        <label className="block text-sm font-medium mb-1.5">Category</label>
        <select
          value={currentCategory}
          onChange={(e) => update("category__slug", e.target.value)}
          className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2"
          style={{ borderColor: "#ddd" }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}