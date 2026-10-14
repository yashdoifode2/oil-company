import Link from "next/link";
import type { HomepageSection } from "@/types/cms";

export function CTASection({ section }: { section: HomepageSection }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, var(--color-primary) 0%, #0a3d94 50%, #082b6a 100%)",
      }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 40%, #fff 1px, transparent 1px), radial-gradient(circle at 60% 80%, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />

      <div className="container-site relative py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="max-w-2xl text-center md:text-left">
            {section.heading && (
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 leading-tight">
                {section.heading}
              </h2>
            )}
            {section.description && (
              <p className="text-lg text-white/85 leading-relaxed">
                {section.description}
              </p>
            )}
          </div>
          {section.button_text && section.button_url && (
            <Link
              href={section.button_url}
              className="btn btn-primary btn-lg shrink-0"
            >
              {section.button_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}