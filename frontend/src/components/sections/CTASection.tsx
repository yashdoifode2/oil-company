import Link from "next/link";
import type { HomepageSection } from "@/types/cms";

export function CTASection({ section }: { section: HomepageSection }) {
  return (
    <section className="py-16 md:py-20" style={{ background: "var(--color-primary)", color: "#fff" }}>
      <div className="container-site text-center max-w-3xl">
        {section.heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.heading}</h2>}
        {section.description && <p className="text-lg opacity-90 mb-8">{section.description}</p>}
        {section.button_text && section.button_url && (
          <Link href={section.button_url} className="btn" style={{ background: "#fff", color: "var(--color-primary)" }}>
            {section.button_text}
          </Link>
        )}
      </div>
    </section>
  );
}