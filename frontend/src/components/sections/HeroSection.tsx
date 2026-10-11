import Link from "next/link";
import type { HomepageSection } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

const alignClass = { left: "text-left items-start", center: "text-center items-center", right: "text-right items-end" };

export function HeroSection({ section }: { section: HomepageSection }) {
  const bg = section.background_image || section.main_image;
  const opacity = Math.max(0, Math.min(100, section.overlay_opacity)) / 100;

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "520px" }}>
      {bg && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(bg)} alt={section.image_alt || ""} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${opacity})` }} />
        </div>
      )}
      <div className={`container-site relative py-24 flex flex-col ${alignClass[section.text_alignment]} ${bg ? "text-white" : ""}`}>
        {section.subtitle && (
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: bg ? "var(--color-secondary)" : "var(--color-primary)" }}>
            {section.subtitle}
          </p>
        )}
        {section.heading && (
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">{section.heading}</h1>
        )}
        {section.description && (
          <p className="mt-6 text-lg max-w-2xl opacity-90">{section.description}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {section.button_text && section.button_url && (
            <Link href={section.button_url} className="btn btn-primary">{section.button_text}</Link>
          )}
          {section.secondary_button_text && section.secondary_button_url && (
            <Link href={section.secondary_button_url} className="btn btn-outline" style={bg ? { color: "#fff", borderColor: "#fff" } : undefined}>
              {section.secondary_button_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}