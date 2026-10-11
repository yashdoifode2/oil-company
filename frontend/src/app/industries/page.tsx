import type { Metadata } from "next";
import Link from "next/link";
import { apiGet, mediaUrl } from "@/lib/api";
import type { Industry, Paginated } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "Specialized oil solutions for automotive, manufacturing, food, energy, and marine.",
};

export default async function IndustriesPage() {
  let industries: Industry[] = [];
  try {
    const res = await apiGet<Paginated<Industry>>("/industries/?page_size=50", {
      revalidate: 300,
      tags: ["industries"],
    });
    industries = res.results;
  } catch (err) {
    console.error("[industries] fetch failed:", err);
  }

  return (
    <div className="container-site py-12">
      <Breadcrumbs items={[{ label: "Industries" }]} />
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Industries We Serve</h1>
        <p className="text-gray-600 max-w-2xl">
          Specialized oil solutions for demanding environments and industries.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((ind) => (
          <Link
            key={ind.id}
            href={`/industries/${ind.slug}/`}
            className="group block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {ind.featured_image && (
              <div className="aspect-video bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(ind.featured_image)}
                  alt={ind.image_alt || ind.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            )}
            <div className="p-5">
              <h2 className="font-semibold text-lg mb-2">{ind.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{ind.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}