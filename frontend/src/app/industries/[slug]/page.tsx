import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet, mediaUrl } from "@/lib/api";
import type { Industry } from "@/types/cms";
import { PageBanner } from "@/components/layout/PageBanner";
import { RichText } from "@/components/ui/RichText";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

async function loadIndustry(slug: string): Promise<Industry | null> {
  try {
    return await apiGet<Industry>(`/industries/${slug}/`, {
      revalidate: 300,
      tags: [`industry:${slug}`, "industries"],
    });
  } catch (err) {
    console.error(`[industry:${slug}] load failed:`, err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = await loadIndustry(slug);
  if (!ind) return { title: "Industry not found" };
  return {
    title: ind.seo_title || ind.name,
    description: ind.meta_description || ind.description.slice(0, 160),
  };
}

export default async function IndustryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const industry = await loadIndustry(slug);
  if (!industry) notFound();

  return (
    <>
      <PageBanner
        eyebrow="Industry"
        title={industry.name}
        image={
          industry.featured_image
            ? mediaUrl(industry.featured_image)
            : "/hero-industries.jpg"
        }
        breadcrumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.name },
        ]}
        size="compact"
      />

      <div className="container-site py-16 max-w-4xl">
        {industry.description && <RichText html={industry.description} />}

        {industry.technical_information && (
          <div className="mt-10 p-6 bg-[var(--color-surface)] rounded-lg">
            <h2 className="font-semibold mb-2">Technical Information</h2>
            <p className="text-[var(--color-muted)] whitespace-pre-line">
              {industry.technical_information}
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={`/contact?industry=${encodeURIComponent(industry.name)}`}
            className="btn btn-primary btn-lg"
          >
            Discuss your requirements
          </Link>
          <Link href="/products" className="btn btn-outline btn-lg">
            View Products
          </Link>
        </div>
      </div>
    </>
  );
}