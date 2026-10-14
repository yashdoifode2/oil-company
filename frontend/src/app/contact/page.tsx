import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { SiteBootstrap } from "@/types/cms";
import { PageBanner } from "@/components/layout/PageBanner";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Premium Oil's team. Request a quote or ask a question.",
};

type SearchParams = Promise<{
  product?: string;
  industry?: string;
  message?: string;
}>;

export default async function ContactPage({
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
        bannerKey="contact"
        breadcrumbs={[{ label: "Contact" }]}
      />

      <div className="container-site py-16">
        <div className="grid lg:grid-cols-[400px_1fr] gap-12">
          <aside className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-6">Get in touch</h2>
              <ul className="space-y-5">
                {company?.phone_primary && (
                  <li className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(11,61,145,0.08)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.07 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.09a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--color-muted)] mb-0.5">
                        Call us
                      </div>
                      <a
                        href={`tel:${company.phone_primary.replace(/\s/g, "")}`}
                        className="font-semibold"
                      >
                        {company.phone_primary}
                      </a>
                    </div>
                  </li>
                )}
                {company?.email && (
                  <li className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(11,61,145,0.08)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--color-muted)] mb-0.5">
                        Email
                      </div>
                      <a href={`mailto:${company.email}`} className="font-semibold">
                        {company.email}
                      </a>
                    </div>
                  </li>
                )}
                {company?.address && (
                  <li className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(11,61,145,0.08)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--color-muted)] mb-0.5">
                        Address
                      </div>
                      <div className="font-semibold whitespace-pre-line">
                        {company.address}
                      </div>
                    </div>
                  </li>
                )}
                {company?.business_hours && (
                  <li className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(11,61,145,0.08)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--color-muted)] mb-0.5">
                        Business hours
                      </div>
                      <div className="font-semibold">{company.business_hours}</div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </aside>

          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <QuoteForm
              initialProduct={sp.product ?? ""}
              initialIndustry={sp.industry ?? ""}
              initialMessage={sp.message ?? ""}
            />
          </div>
        </div>
      </div>
    </>
  );
}