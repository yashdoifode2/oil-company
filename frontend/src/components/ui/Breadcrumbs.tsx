import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:underline">Home</Link></li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {c.href ? (
              <Link href={c.href} className="hover:underline">{c.label}</Link>
            ) : (
              <span className="text-gray-800">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}