import type { HomepageSection } from "@/types/cms";

type TrustItem = { title: string; subtitle: string };

export function TrustSection({ section }: { section: HomepageSection }) {
  const items = (section.config?.items as TrustItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="bg-white border-b border-[var(--color-border)]">
      <div className="container-site py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(11,61,145,0.08)",
                  color: "var(--color-primary)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="min-w-0">
                <div
                  className="text-2xl md:text-3xl font-bold leading-tight"
                  style={{ color: "var(--color-primary)" }}
                >
                  {it.title}
                </div>
                <div className="text-sm text-[var(--color-muted)] mt-0.5 truncate">
                  {it.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}