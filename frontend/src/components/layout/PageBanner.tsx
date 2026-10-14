import Link from "next/link";
import type { ReactNode } from "react";
import { getBanner, mediaUrl } from "@/lib/api";

type BreadcrumbItem = { label: string; href?: string };

type Props = {
  /** Look up the banner by key from Django (preferred) */
  bannerKey?: string;
  /** Fallback values when no banner exists in the CMS */
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  size?: "default" | "tall" | "compact";
};

const HEIGHTS: Record<NonNullable<Props["size"]>, string> = {
  default: "py-16 md:py-20 min-h-[320px] md:min-h-[380px]",
  tall: "py-20 md:py-28 min-h-[420px] md:min-h-[520px]",
  compact: "py-12 md:py-16 min-h-[240px] md:min-h-[280px]",
};

export async function PageBanner({
  bannerKey,
  eyebrow,
  title,
  description,
  image,
  breadcrumbs,
  children,
  size = "default",
}: Props) {
  // Prefer CMS banner, fall back to props
  const cms = bannerKey ? await getBanner(bannerKey) : null;

  const finalEyebrow = cms?.eyebrow ?? eyebrow;
  const finalTitle = cms?.heading ?? title ?? "";
  const finalDescription = cms?.description ?? description;
  const finalImage = cms?.image ? mediaUrl(cms.image) : image;
  const overlay = cms?.overlay_opacity ?? 78;

  return (
    <section className="relative overflow-hidden">
      {finalImage ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={finalImage}
            alt={cms?.image_alt || ""}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(100deg, rgba(11,61,145,${overlay / 100}) 0%, rgba(11,61,145,${(overlay * 0.8) / 100}) 45%, rgba(11,61,145,${(overlay * 0.4) / 100}) 75%, rgba(11,61,145,${(overlay * 0.2) / 100}) 100%)`,
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, #082b6a 100%)",
          }}
        />
      )}

      <div className={`container-site relative text-white flex items-center ${HEIGHTS[size]}`}>
        <div className="max-w-3xl w-full">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="text-sm text-white/70 mb-5">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span aria-hidden className="text-white/40">/</span>
                    {c.href ? (
                      <Link href={c.href} className="hover:text-white transition-colors">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-white">{c.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {finalEyebrow && (
            <p
              className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 inline-flex items-center gap-3"
              style={{ color: "var(--color-secondary)" }}
            >
              <span className="w-8 h-[2px]" style={{ background: "var(--color-secondary)" }} />
              {finalEyebrow}
            </p>
          )}

          {finalTitle && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
              {finalTitle}
            </h1>
          )}

          {finalDescription && (
            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              {finalDescription}
            </p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}