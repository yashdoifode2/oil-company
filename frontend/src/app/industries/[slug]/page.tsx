import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiGet, mediaUrl } from "@/lib/api";
import type { Industry } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { Button } from "@/components/ui/Button";

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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
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
    <div className="container-site py-12">
      <Breadcrumbs items={[{ label: "Industries", href: "/industries" }, { label: industry.name }]} />
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-4xl font-bold mb-5">{industry.name}</h1>
          <RichText html={industry.description} />
          {industry.technical_information && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="font-semibold mb-2">Technical Information</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {industry.technical_information}
              </p>
            </div>
          )}
          <div className="mt-8">
            <Button href={`/contact?industry=${encodeURIComponent(industry.name)}`} size="lg">
              Discuss your requirements
            </Button>
          </div>
        </div>
        {industry.featured_image && (
          <div className="rounded-lg overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(industry.featured_image)}
              alt={industry.image_alt || industry.name}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}