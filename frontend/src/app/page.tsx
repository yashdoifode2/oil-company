import { apiGet } from "@/lib/api";
import type { HomepageSection } from "@/types/cms";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export const revalidate = 60;

export default async function HomePage() {
  let sections: HomepageSection[] = [];
  try {
    const res = await apiGet<{ sections: HomepageSection[] }>("/homepage/", {
      revalidate: 60,
      tags: ["homepage"],
    });
    sections = res.sections;
  } catch { /* ignore */ }

  return (
    <>
      {sections.map((s) => <SectionRenderer key={s.id} section={s} />)}
    </>
  );
}