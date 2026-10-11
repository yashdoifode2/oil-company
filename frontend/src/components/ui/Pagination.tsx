import Link from "next/link";

export function Pagination({
  current,
  total,
  basePath,
  query,
}: {
  current: number;
  total: number;
  basePath: string;
  query?: Record<string, string>;
}) {
  if (total <= 1) return null;

  const buildHref = (page: number) => {
    const q = new URLSearchParams(query ?? {});
    if (page > 1) q.set("page", String(page));
    else q.delete("page");
    const qs = q.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 2
  );

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      {current > 1 && (
        <Link href={buildHref(current - 1)} className="px-3 py-2 border rounded hover:bg-gray-50">
          ← Prev
        </Link>
      )}
      {visible.map((p, i) => {
        const prev = visible[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {gap && <span className="px-2 text-gray-400">…</span>}
            <Link
              href={buildHref(p)}
              className={`px-3 py-2 border rounded hover:bg-gray-50 ${
                p === current ? "font-semibold" : ""
              }`}
              style={p === current ? { background: "var(--color-button)", color: "var(--color-button-text)", borderColor: "var(--color-button)" } : undefined}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {current < total && (
        <Link href={buildHref(current + 1)} className="px-3 py-2 border rounded hover:bg-gray-50">
          Next →
        </Link>
      )}
    </nav>
  );
}