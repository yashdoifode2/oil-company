import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { SiteBootstrap } from "@/types/cms";
import { PageBanner } from "@/components/layout/PageBanner";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Get pricing for Premium Oil products. Send us your requirements and we'll respond within one business day.",
};

type SearchParams = Promise<{ product?: string; industry?: string }>;

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  let company = null;
  try {
    const site = await apiGet<SiteBootstrap>("/site/", {
      revalidate: 300,
      tags: ["site"],
    });
    company = site.company;
  } catch {
    /* ignore */
  }

  return (
    <>
      <PageBanner
        bannerKey="request-quote"
        breadcrumbs={[{ label: "Request a Quote" }]}
      />

      <div className="container-site py-16">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Your details</h2>
            <QuoteForm
              initialProduct={sp.product ?? ""}
              initialIndustry={sp.industry ?? ""}
            />
          </div>

          <aside className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-lg p-6">
              <h3 className="font-bold mb-4">Why request a quote?</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Pricing tailored to your volume and delivery location",
                  "Technical guidance on the right product for your application",
                  "Sample arrangements available on request",
                  "Response within one business day",
                ].map((t) => (
                  <li key={t} className="flex gap-2 items-start">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{
                        color: "var(--color-primary)",
                        flexShrink: 0,
                        marginTop: 3,
                      }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[var(--color-muted)]">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {company && (
              <div className="border rounded-lg p-6">
                <h3 className="font-bold mb-4">Prefer to talk?</h3>
                {company.phone_primary && (
                  <a
                    href={`tel:${company.phone_primary.replace(/\s/g, "")}`}
                    className="block mb-3"
                  >
                    <div className="text-xs text-[var(--color-muted)]">Phone</div>
                    <div className="font-semibold">{company.phone_primary}</div>
                  </a>
                )}
                {company.email && (
                  <a href={`mailto:${company.email}`} className="block">
                    <div className="text-xs text-[var(--color-muted)]">Email</div>
                    <div className="font-semibold">{company.email}</div>
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}