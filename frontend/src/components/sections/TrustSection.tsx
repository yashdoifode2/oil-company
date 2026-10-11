import type { HomepageSection } from "@/types/cms";

type TrustItem = { title: string; subtitle: string };

export function TrustSection({ section }: { section: HomepageSection }) {
  const items = (section.config?.items as TrustItem[] | undefined) ?? [];
  if (!items.length) return null;
  return (
    <section className="py-16 border-b">
      <div className="container-site">
        {section.heading && <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{section.heading}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{it.title}</div>
              <div className="text-sm text-gray-600 mt-1">{it.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}