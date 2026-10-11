import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiGet, mediaUrl } from "@/lib/api";
import type { PageDetail, PageSection } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { Button } from "@/components/ui/Button";

export const revalidate = 120;

type Params = Promise<{ slug: string[] }>;

async function loadPage(slug: string): Promise<PageDetail | null> {
  try {
    return await apiGet<PageDetail>(`/pages/${slug}/`, {
      revalidate: 120,
      tags: [`page:${slug}`, "pages"],
    });
  } catch (err) {
    console.error(`[page:${slug}] load failed:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadPage(slug.join("/"));
  if (!page) return { title: "Page not found" };
  return {
    title: page.seo_title || page.title,
    description: page.meta_description || page.short_description,
  };
}

export default async function DynamicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await loadPage(slug.join("/"));
  if (!page) notFound();

  return (
    <div className="container-site py-12">
      <Breadcrumbs items={[{ label: page.title }]} />
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
        {page.short_description && (
          <p className="text-gray-600 max-w-3xl">{page.short_description}</p>
        )}
      </header>
      {page.featured_image && (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(page.featured_image)}
            alt={page.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {page.content && (
        <div className="max-w-3xl mb-12">
          <RichText html={page.content} />
        </div>
      )}
      {page.sections.map((s) => (
        <PageSectionRenderer key={s.id} section={s} />
      ))}
    </div>
  );
}

function PageSectionRenderer({ section }: { section: PageSection }) {
  switch (section.section_type) {
    case "hero":
      return (
        <section className="py-16 text-center">
          {section.subtitle && (
            <p className="text-sm uppercase font-semibold mb-3" style={{ color: "var(--color-primary)" }}>
              {section.subtitle}
            </p>
          )}
          {section.heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.heading}</h2>}
          {section.body && <RichText html={section.body} className="max-w-2xl mx-auto" />}
          {section.button_text && section.button_url && (
            <div className="mt-6">
              <Button href={section.button_url}>{section.button_text}</Button>
            </div>
          )}
        </section>
      );
    case "text_image":
      return (
        <section className="py-16 grid md:grid-cols-2 gap-12 items-center">
          {section.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(section.image)}
              alt={section.image_alt || section.heading}
              className="w-full rounded-lg"
            />
          )}
          <div className={section.image ? "" : "md:col-span-2 max-w-3xl mx-auto"}>
            {section.heading && <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>}
            {section.body && <RichText html={section.body} />}
            {section.button_text && section.button_url && (
              <div className="mt-6">
                <Button href={section.button_url}>{section.button_text}</Button>
              </div>
            )}
          </div>
        </section>
      );
    case "rich_text":
      return (
        <section className="py-12 max-w-3xl mx-auto">
          {section.heading && <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>}
          <RichText html={section.body} />
        </section>
      );
    case "cta":
      return (
        <section className="py-16 -mx-4 px-4" style={{ background: "var(--color-primary)", color: "#fff" }}>
          <div className="container-site text-center">
            {section.heading && <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>}
            {section.body && <p className="mb-8 opacity-90">{section.body}</p>}
            {section.button_text && section.button_url && (
              <Button
                href={section.button_url}
                style={{ background: "#fff", color: "var(--color-primary)" } as never}
              >
                {section.button_text}
              </Button>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }
}