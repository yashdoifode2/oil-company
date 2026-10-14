import Link from "next/link";
import type { HomepageSection } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

type StatItem = { value: string; label: string };

export function CompanyIntroSection({
  section,
}: {
  section: HomepageSection;
}) {
  const stats = (section.config?.stats as StatItem[] | undefined) ?? [];
  const img = section.main_image;

  return (
    <section
      className="py-16 md:py-24 text-white"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, #082b6a 100%)",
      }}
    >
      <div className="container-site grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {img && (
          <div className="order-2 md:order-1 relative">
            <div
              className="absolute -inset-3 rounded-2xl opacity-15"
              style={{ background: "var(--color-secondary)" }}
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(img)}
              alt={section.image_alt || section.heading}
              className="relative rounded-xl w-full shadow-2xl"
            />
          </div>
        )}
        <div className={`order-1 md:order-2 ${img ? "" : "md:col-span-2 max-w-3xl"}`}>
          {section.subtitle && (
            <span
              className="text-xs uppercase tracking-[0.2em] font-bold mb-4 inline-block"
              style={{ color: "var(--color-secondary)" }}
            >
              {section.subtitle}
            </span>
          )}
          {section.heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-white">
              {section.heading}
            </h2>
          )}
          {section.description && (
            <p className="text-lg text-white/80 leading-relaxed mb-8 whitespace-pre-line">
              {section.description}
            </p>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-6 mb-8 pt-6 border-t border-white/15">
              {stats.map((s, i) => (
                <div key={i}>
                  <div
                    className="text-3xl md:text-4xl font-bold mb-1"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-sm text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {section.button_text && section.button_url && (
            <Link href={section.button_url} className="btn btn-primary">
              {section.button_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}