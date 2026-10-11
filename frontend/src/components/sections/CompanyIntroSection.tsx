import Link from "next/link";
import type { HomepageSection } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

export function CompanyIntroSection({ section }: { section: HomepageSection }) {
  const img = section.main_image;
  return (
    <section className="py-16 md:py-20">
      <div className="container-site grid md:grid-cols-2 gap-12 items-center">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(img)} alt={section.image_alt || section.heading} className="w-full rounded-lg shadow-lg" />
        )}
        <div className={img ? "" : "md:col-span-2 max-w-3xl"}>
          {section.subtitle && <div className="text-sm uppercase font-semibold mb-2" style={{ color: "var(--color-primary)" }}>{section.subtitle}</div>}
          {section.heading && <h2 className="text-3xl md:text-4xl font-bold mb-5">{section.heading}</h2>}
          {section.description && <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">{section.description}</p>}
          {section.button_text && section.button_url && (
            <Link href={section.button_url} className="btn btn-primary">{section.button_text}</Link>
          )}
        </div>
      </div>
    </section>
  );
}