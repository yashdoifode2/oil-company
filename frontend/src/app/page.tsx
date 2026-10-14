import { apiGet } from "@/lib/api";
import type { HomepageSection, SiteBootstrap } from "@/types/cms";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { FloatingContact } from "@/components/layout/FloatingContact";

export const revalidate = 60;

export default async function HomePage() {
  let sections: HomepageSection[] = [];
  let site: SiteBootstrap | null = null;

  try {
    const res = await apiGet<{ sections: HomepageSection[] }>("/homepage/", {
      revalidate: 60,
      tags: ["homepage"],
    });
    sections = res.sections;
  } catch { /* ignore */ }

  try {
    site = await apiGet<SiteBootstrap>("/site/", {
      revalidate: 300,
      tags: ["site"],
    });
  } catch { /* ignore */ }

  return (
    <>
      {sections.map((s) => <SectionRenderer key={s.id} section={s} />)}

      {site && (
        <FloatingContact
          phone={site.company.phone_primary}
          email={site.company.email}
          whatsapp={site.company.whatsapp}
          hours={site.company.business_hours}
        />
      )}
    </>
  );
}