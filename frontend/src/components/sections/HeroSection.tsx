import Link from "next/link";
import type { HomepageSection } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

export function HeroSection({ section }: { section: HomepageSection }) {
  const bg = section.background_image || section.main_image;
  const hasImage = Boolean(bg);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      {hasImage ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(bg!)}
            alt={section.image_alt || ""}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(11,61,145,0.96) 0%, rgba(11,61,145,0.82) 45%, rgba(11,61,145,0.45) 75%, rgba(11,61,145,0.25) 100%)",
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

      {/* Content */}
      <div className="container-site relative py-20 md:py-28 lg:py-32 min-h-[560px] md:min-h-[640px] flex items-center">
        <div className="max-w-3xl text-white">
          {section.subtitle && (
            <p
              className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-5 inline-flex items-center gap-3"
              style={{ color: "var(--color-secondary)" }}
            >
              <span
                className="w-8 h-[2px]"
                style={{ background: "var(--color-secondary)" }}
              />
              {section.subtitle}
            </p>
          )}

          {section.heading && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
              {section.heading}
            </h1>
          )}

          {section.description && (
            <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8 max-w-2xl">
              {section.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {section.button_text && section.button_url && (
              <Link
                href={section.button_url}
                className="btn btn-primary btn-lg"
              >
                {section.button_text}
              </Link>
            )}
            {section.secondary_button_text && section.secondary_button_url && (
              <Link
                href={section.secondary_button_url}
                className="btn btn-outline-light btn-lg"
              >
                {section.secondary_button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}