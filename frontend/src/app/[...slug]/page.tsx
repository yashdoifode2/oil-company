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
      {/* ---------- Fallback header when there's no Hero section ---------- */}
      {!hasHero && (
        <PageHeader page={page} />
      )}

      {/* ---------- CMS sections ---------- */}
      {page.sections.map((s) => (
        <PageSectionRenderer key={s.id} section={s} />
      ))}
    </article>
  );
}

/**
 * Fallback header used when a CMS page has no explicit Hero section.
 * Renders the navy gradient + featured image, matching the rest of the site.
 */
function PageHeader({ page }: { page: PageDetail }) {
  const hasImage = Boolean(page.featured_image);

  return (
    <section className="relative overflow-hidden">
      {hasImage ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(page.featured_image!)}
            alt={page.title}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(11,61,145,0.94) 0%, rgba(11,61,145,0.78) 45%, rgba(11,61,145,0.42) 75%, rgba(11,61,145,0.22) 100%)",
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

      <div className="container-site relative py-20 md:py-24 min-h-[320px] md:min-h-[380px] flex items-center text-white">
        <div className="max-w-3xl w-full">
          <Breadcrumbs items={[{ label: page.title }]} />
          <p
            className="text-xs uppercase tracking-[0.2em] font-bold mb-4 inline-flex items-center gap-3"
            style={{ color: "var(--color-secondary)" }}
          >
            <span
              className="w-8 h-[2px]"
              style={{ background: "var(--color-secondary)" }}
            />
            Our Company
          </p>
          <h1 className="text-4xl md:text-5xl font-bold max-w-4xl leading-[1.1] mb-4">
            {page.title}
          </h1>
          {page.short_description && (
            <p className="text-lg text-white/85 max-w-2xl leading-relaxed">
              {page.short_description}
            </p>
          )}
        </div>
      </div>
    </section>
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

/* ---------------- Hero: image + navy gradient ---------------- */

function HeroBlock({ section }: { section: PageSection }) {
  const hasImage = Boolean(section.image);

  return (
    <section className="relative overflow-hidden">
      {hasImage ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(section.image!)}
            alt={section.image_alt || section.heading || ""}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(11,61,145,0.94) 0%, rgba(11,61,145,0.78) 45%, rgba(11,61,145,0.42) 75%, rgba(11,61,145,0.22) 100%)",
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

      <div className="container-site relative py-20 md:py-28 min-h-[420px] md:min-h-[520px] flex items-center text-white">
        <div className="max-w-3xl w-full">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              {section.heading}
            </h1>
          )}

          {section.body && (
            <div className="max-w-2xl text-lg text-white/85 leading-relaxed">
              <RichText html={section.body} />
            </div>
          )}

          {section.button_text && section.button_url && (
            <div className="mt-8">
              <Button
                href={section.button_url}
                size="lg"
                variant="primary"
              >
                {section.button_text}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Text + Image ---------------- */

function TextImageBlock({ section }: { section: PageSection }) {
  const imageRight = section.config?.image_position === "right";

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container-site grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {section.image && (
          <div className={imageRight ? "md:order-2" : ""}>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-2xl opacity-[0.08]"
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
              className="text-xs uppercase tracking-[0.2em] font-bold mb-3 inline-block"
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
            <div className="text-[var(--color-muted)] leading-relaxed space-y-4">
              <RichText html={section.body} />
            </div>
          )}
          {section.button_text && section.button_url && (
            <div className="mt-8">
              <Button href={section.button_url} variant="primary">
                {section.button_text}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Rich text ---------------- */

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

/* ---------------- Stats ---------------- */

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
      className="py-14 md:py-16"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, #082b6a 100%)",
      }}
    >
      <div className="container-site">
        {section.heading && (
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
            {section.heading}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((it, i) => (
            <div key={i}>
              <div
                className="text-4xl md:text-5xl font-bold mb-2 leading-none"
                style={{ color: "var(--color-secondary)" }}
              >
                {it.value}
              </div>
              <div className="text-sm text-white/75 uppercase tracking-wide">
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mission & Vision ---------------- */

function MissionVisionBlock({ section }: { section: PageSection }) {
  const data = (section.config as MissionVisionData) ?? {};
  const items = [
    {
      key: "mission",
      label: "Our Mission",
      text: data.mission,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      key: "vision",
      label: "Our Vision",
      text: data.vision,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ].filter((i) => i.text);

  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="container-site">
        {section.heading && (
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="section-eyebrow">Purpose</span>
            <h2 className="section-title">{section.heading}</h2>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((it) => (
            <div
              key={it.key}
              className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-white"
                style={{ background: "var(--color-primary)" }}
              >
                {it.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{it.label}</h3>
              <div className="text-[var(--color-muted)] leading-relaxed">
                <RichText html={it.text ?? ""} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Values ---------------- */

function ValuesBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as ValueItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="section-eyebrow">Our Values</span>
          {section.heading && <h2 className="section-title">{section.heading}</h2>}
          {section.body && (
            <div className="section-subtitle mx-auto">
              <RichText html={section.body} />
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div
              key={i}
              className="group p-7 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all bg-white"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-white mb-5 group-hover:scale-105 transition-transform"
                style={{ background: "var(--color-primary)" }}
              >
                {it.icon ?? it.title.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold mb-3">{it.title}</h3>
              <p className="text-[var(--color-muted)] leading-relaxed text-sm">
                {it.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Timeline ---------------- */

function TimelineBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as TimelineItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="container-site max-w-3xl">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Our Journey</span>
          {section.heading && <h2 className="section-title">{section.heading}</h2>}
        </div>

        <ol className="relative">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-[2px]"
            style={{ background: "var(--color-border)" }}
            aria-hidden
          />
          {items.map((it, i) => (
            <li key={i} className="relative pl-10 pb-10 last:pb-0">
              <span
                className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ background: "var(--color-primary)" }}
              />
              <div
                className="text-xs uppercase tracking-[0.14em] font-bold mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                {it.year}
              </div>
              <h3 className="text-lg font-semibold mb-2">{it.title}</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                {it.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Team ---------------- */

function TeamBlock({ section }: { section: PageSection }) {
  const items = (section.config?.items as TeamItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="section-eyebrow">Our Team</span>
          {section.heading && <h2 className="section-title">{section.heading}</h2>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((it, i) => (
            <div key={i} className="text-center">
              <div className="aspect-square rounded-full overflow-hidden bg-[var(--color-surface)] mb-5 mx-auto max-w-[200px]">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      it.image.startsWith("http") ? it.image : mediaUrl(it.image)
                    }
                    alt={it.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-4xl font-bold"
                    style={{
                      background: "rgba(11,61,145,0.08)",
                      color: "var(--color-primary)",
                    }}
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
              {it.bio && (
                <p className="text-sm text-[var(--color-muted)]">{it.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Certifications ---------------- */

function CertificationsBlock({ section }: { section: PageSection }) {
  const items =
    (section.config?.items as CertificationItem[] | undefined) ?? [];
  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="container-site">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="section-eyebrow">Standards</span>
          {section.heading && <h2 className="section-title">{section.heading}</h2>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {items.map((it, i) => (
            <div
              key={i}
              className="bg-white border border-[var(--color-border)] rounded-xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(11,61,145,0.08)",
                  color: "var(--color-primary)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{it.name}</h3>
                {it.detail && (
                  <p className="text-sm text-[var(--color-muted)]">{it.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */

// function CTABlock({ section }: { section: PageSection }) {
//   return (
//     <section
//       className="relative overflow-hidden"
//       style={{
//         background:
//           "linear-gradient(120deg, var(--color-primary) 0%, #0a3d94 50%, #082b6a 100%)",
//       }}
//     >
//       <div
//         className="absolute inset-0 opacity-[0.06]"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle at 20% 40%, #fff 1px, transparent 1px), radial-gradient(circle at 60% 80%, #fff 1px, transparent 1px)",
//           backgroundSize: "80px 80px",
//         }}
//         aria-hidden
//       />
//       <div className="container-site relative py-16 md:py-20 text-white text-center max-w-3xl mx-auto">
//         {section.heading && (
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.heading}</h2>
//         )}
//         {section.body && (
//           <div className="text-lg text-white/85 mb-8">
//             <RichText html={section.body} />
//           </div>
//         )}
//         {section.button_text && section.button_url && (
//           <Button
//             href={section.button_url}
//             size="lg"
//             variant="primary"
//           >
//             {section.button_text}
//           </Button>
//         )}
//       </div>
//     </section>
//   );
// }