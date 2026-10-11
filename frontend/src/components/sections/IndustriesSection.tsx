import Link from "next/link";
import type { HomepageSection, Industry, Paginated } from "@/types/cms";
import { apiGet, mediaUrl } from "@/lib/api";

export async function IndustriesSection({ section }: { section: HomepageSection }) {
  const limit = (section.config?.limit as number | undefined) ?? 6;
  let industries: Industry[] = [];
  try {
    const res = await apiGet<Paginated<Industry>>(`/industries/?page_size=${limit}`, { revalidate: 300, tags: ["industries"] });
    industries = res.results;
  } catch { /* ignore */ }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container-site">
        {section.heading && <h2 className="text-3xl font-bold mb-3">{section.heading}</h2>}
        {section.description && <p className="text-gray-600 mb-10 max-w-2xl">{section.description}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <Link key={ind.id} href={`/industries/${ind.slug}/`} className="group block bg-white rounded-lg overflow-hidden border hover:shadow-md transition">
              {ind.featured_image && (
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(ind.featured_image)} alt={ind.image_alt || ind.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold">{ind.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}