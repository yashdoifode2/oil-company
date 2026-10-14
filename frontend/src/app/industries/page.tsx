import type { Metadata } from "next";
import Link from "next/link";
import { apiGet, mediaUrl } from "@/lib/api";
import type { Industry, Paginated } from "@/types/cms";
import { PageBanner } from "@/components/layout/PageBanner";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Specialized oil solutions for automotive, manufacturing, food, energy, and marine.",
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
    <>
      <PageBanner
        bannerKey="industries"
        breadcrumbs={[{ label: "Industries" }]}
      />

      <div className="container-site py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <Link
              key={ind.id}
              href={`/industries/${ind.slug}/`}
              className="group card hover-lift block"
            >
              {ind.featured_image && (
                <div className="aspect-video bg-[var(--color-surface)] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(ind.featured_image)}
                    alt={ind.image_alt || ind.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {ind.name}
                </h2>
                <p className="text-sm text-[var(--color-muted)] line-clamp-2">
                  {ind.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {!industries.length && (
          <div className="text-center py-16 text-[var(--color-muted)]">
            No industries published yet.
          </div>
        )}
      </div>
    </>
  );
}