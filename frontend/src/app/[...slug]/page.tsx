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

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
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

  const hasHero = page.sections.some((s) => s.section_type === "hero");

  return (
    <article>
      {/* ---------- Page header (skipped if a Hero section exists) ---------- */}
      {!hasHero && (
        <header
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, #0a2c66 100%)",
          }}
        >
          <div className="container-site py-20 md:py-24 text-white">
            <Breadcrumbs items={[{ label: page.title }]} />
            <p
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
              style={{ color: "var(--color-secondary)" }}
            >
              Our Company
            </p>
            <h1 className="text-4xl md:text-5xl font-bold max-w-4xl leading-tight">
              {page.title}
            </h1>
            {page.short_description && (
              <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
                {page.short_description}
              </p>
            )}
          </div>
        </header>
      )}

      {/* ---------- Featured image ---------- */}
      {page.featured_image && !hasHero && (
        <div className="container-site -mt-12 md:-mt-16 relative z-10">
          <div className="aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(page.featured_image)}
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ---------- Standalone content ---------- */}
      {page.content && (
        <section className="container-site py-16 max-w-3xl">
          <RichText html={page.content} />
        </section>
      )}

      {/* ---------- CMS sections ---------- */}
      {page.sections.map((s) => (
        <PageSectionRenderer key={s.id} section={s} />
      ))}
    </article>
  );
}

/* ============================================================
 * Section renderers
 * ============================================================ */

function PageSectionRenderer({ section }: { section: PageSection }) {
  switch (section.section_type) {
    case "hero":
      return <HeroBlock section={section} />;
    case "text_image":
      return <TextImageBlock section={section} />;
    case "rich_text":
      return <RichTextBlock section={section} />;
    case "stats":
      return <StatsBlock section={section} />;
    case "mission_vision":
      return <MissionVisionBlock section={section} />;
    case "values":
      return <ValuesBlock section={section} />;
    case "timeline":
      return <TimelineBlock section={section} />;
    case "team":
      return <TeamBlock section={section} />;
    case "certifications":
      return <CertificationsBlock section={section} />;
    // case "cta":
    //   return <CTABlock section={section} />;
    default:
      return null;
  }
}

/* ---------------- Individual blocks ---------------- */

function HeroBlock({ section }: { section: PageSection }) {
  const hasImage = Boolean(section.image);
  const overlay = 0.55;

  return (
    <section className="relative overflow-hidden">
      {hasImage && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(section.image!)}
            alt={section.image_alt || section.heading}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `rgba(0,0,0,${overlay})` }}
          />
        </div>
      )}
      <div
        className={`container-site relative py-24 md:py-32 ${
          hasImage ? "text-white" : ""
        }`}
      >
        {section.subtitle && (
          <p
            className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: "var(--color-secondary)" }}
          >
            {section.subtitle}
          </p>
        )}
        {section.heading && (
          <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl">
            {section.heading}
          </h2>
        )}
        {section.body && (
          <div className="mt-6 max-w-2xl text-lg opacity-90">
            <RichText html={section.body} />
          </div>
        )}
        {section.button_text && section.button_url && (
          <div className="mt-8">
            <Button
              href={section.button_url}
              size="lg"
              variant={hasImage ? "outline" : "primary"}
              style={
                hasImage
                  ? { borderColor: "#fff", color: "#fff", borderWidth: 2 }
                  : undefined
              }
            >
              {section.button_text}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function TextImageBlock({ section }: { section: PageSection }) {
  const imageLeft = section.config?.image_position !== "right";

  return (
    <section className="py-20 md:py-24">
      <div className="container-site grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {section.image && (
          <div className={`${imageLeft ? "" : "md:order-2"}`}>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-2xl opacity-10"
                style={{ background: "var(--color-primary)" }}
                aria-hidden
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(section.image)}
                alt={section.image_alt || section.heading}
                className="relative rounded-xl w-full shadow-lg"
              />
            </div>
          </div>
        )}
        <div className={section.image ? "" : "md:col-span-2 max-w-3xl mx-auto"}>
          {section.subtitle && (
            <p
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              {section.subtitle}
            </p>
          )}
          {section.heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {section.heading}
            </h2>
          )}
          {section.body && (
            <div className="text-gray-700 leading-relaxed space-y-4">
              <RichText html={section.body} />
            </div>
          )}
          {section.button_text && section.button_url && (
            <div className="mt-8">
              <Button href={section.button_url}>{section.button_text}</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RichTextBlock({ section }: { section: PageSection }) {
  return (
    <section className="py-16">
      <div className="container-site max-w-3xl mx-auto">
        {section.heading && (
          <h2 className="text-3xl font-bold mb-6">{section.heading}</h2>
        )}
        <RichText html={section.body} />
      </div>
    </section>
  );
}

type StatItem = { value: string; label: string };
type MissionVisionData = { mission?: string; vision?: string };
type ValueItem = { title: string; description: string; icon?: string };
type TimelineItem = { year: string; title: string; description: string };
type TeamItem = { name: string; role: string; image?: string; bio?: string };
type CertificationItem = { name: string; detail?: string };

function StatsBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as StatItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section
      className="py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, #0a2c66 100%)",
      }}
    >
      <div className="container-site">
        {section.heading && (
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            {section.heading}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((it, i) => (
            <div key={i}>
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: "var(--color-secondary)" }}
              >
                {it.value}
              </div>
              <div className="text-sm uppercase tracking-wider text-white/70">
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionVisionBlock({ section }: { section: PageSection }) {
  const data = (section.config as MissionVisionData) ?? {};
  const items = [
    { key: "mission", label: "Our Mission", text: data.mission, icon: "◆" },
    { key: "vision", label: "Our Vision", text: data.vision, icon: "◈" },
  ].filter((i) => i.text);

  if (!items.length) return null;

  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="container-site">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            {section.heading}
          </h2>
        )}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((it) => (
            <div
              key={it.key}
              className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-5"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                }}
              >
                {it.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{it.label}</h3>
              <RichText html={it.text ?? ""} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as ValueItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="container-site">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{section.heading}</h2>
        )}
        {section.body && (
          <div className="text-gray-600 max-w-2xl mb-14">
            <RichText html={section.body} />
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <div
              key={i}
              className="group p-8 border rounded-xl hover:shadow-md transition bg-white"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white mb-5"
                style={{ background: "var(--color-primary)" }}
              >
                {it.icon ?? i + 1}
              </div>
              <h3 className="text-lg font-semibold mb-3">{it.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {it.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as TimelineItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="container-site max-w-4xl">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-14 text-center">
            {section.heading}
          </h2>
        )}
        <ol className="relative border-l-2 pl-8 space-y-10" style={{ borderColor: "var(--color-primary)" }}>
          {items.map((it, i) => (
            <li key={i} className="relative">
              <span
                className="absolute -left-[42px] top-1 w-5 h-5 rounded-full border-4 border-white shadow"
                style={{ background: "var(--color-primary)" }}
              />
              <div
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                {it.year}
              </div>
              <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
              <p className="text-gray-600 leading-relaxed">{it.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function TeamBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as TeamItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="container-site">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-14 text-center">
            {section.heading}
          </h2>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((it, i) => (
            <div key={i} className="text-center">
              <div className="aspect-square rounded-full overflow-hidden bg-gray-100 mb-5 mx-auto max-w-[200px]">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image.startsWith("http") ? it.image : mediaUrl(it.image)}
                    alt={it.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold"
                    style={{ background: "#f1f5f9", color: "var(--color-primary)" }}
                  >
                    {it.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg">{it.name}</h3>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                {it.role}
              </p>
              {it.bio && <p className="text-sm text-gray-600">{it.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationsBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as CertificationItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="container-site">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-14 text-center">
            {section.heading}
          </h2>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((it, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 flex items-start gap-4"
            >
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold"
                style={{
                  background: "rgba(11,61,145,0.1)",
                  color: "var(--color-primary)",
                }}
              >
                ✓
              </div>
              <div>
                <h3 className="font-semibold mb-1">{it.name}</h3>
                {it.detail && (
                  <p className="text-sm text-gray-600">{it.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// function CTABlock({ section }: { section: PageSection }) {
//   return (
//     <section
//       className="py-20"
//       style={{
//         background:
//           "linear-gradient(135deg, var(--color-primary) 0%, #0a2c66 100%)",
//         color: "#fff",
//       }}
//     >
//       <div className="container-site text-center max-w-3xl mx-auto">
//         {section.heading && (
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             {section.heading}
//           </h2>
//         )}
//         {section.body && (
//           <div className="text-lg opacity-90 mb-8">
//             <RichText html={section.body} />
//           </div>
//         )}
//         {section.button_text && section.button_url && (
//           <Button
//             href={section.button_url}
//             size="lg"
//             style={{ background: "#fff", color: "var(--color-primary)" } as never}
//           >
//             {section.button_text}
//           </Button>
//         )}
//       </div>
//     </section>
//   );
// }