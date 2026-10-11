import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { SiteBootstrap } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Request a quote or get in touch with our team.",
};

type SearchParams = Promise<{ product?: string; industry?: string; message?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  let company = null;
  try {
    const site = await apiGet<SiteBootstrap>("/site/", { revalidate: 300, tags: ["site"] });
    company = site.company;
  } catch (err) {
    console.error("[contact] site fetch failed:", err);
  }

  return (
    <div className="container-site py-12">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-3">Request a Quote</h1>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Tell us about your requirement and our team will respond within one business day.
          </p>
          <QuoteForm
            initialProduct={sp.product ?? ""}
            initialIndustry={sp.industry ?? ""}
            initialMessage={sp.message ?? ""}
          />
        </div>
        <aside className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-4">Contact Details</h2>
            {company ? (
              <ul className="space-y-3 text-sm">
                {company.email && (
                  <li>
                    <span className="text-gray-500 block">Email</span>
                    <a href={`mailto:${company.email}`} className="font-medium">{company.email}</a>
                  </li>
                )}
                {company.phone_primary && (
                  <li>
                    <span className="text-gray-500 block">Phone</span>
                    <a
                      href={`tel:${company.phone_primary.replace(/\s/g, "")}`}
                      className="font-medium"
                    >
                      {company.phone_primary}
                    </a>
                  </li>
                )}
                {company.whatsapp && (
                  <li>
                    <span className="text-gray-500 block">WhatsApp</span>
                    <a
                      href={`https://wa.me/${company.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium"
                    >
                      Message us
                    </a>
                  </li>
                )}
                {company.address && (
                  <li>
                    <span className="text-gray-500 block">Address</span>
                    <span className="font-medium whitespace-pre-line">{company.address}</span>
                  </li>
                )}
                {company.business_hours && (
                  <li>
                    <span className="text-gray-500 block">Business Hours</span>
                    <span className="font-medium">{company.business_hours}</span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Contact details unavailable.</p>
            )}
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="font-semibold mb-3">Prefer to talk?</h2>
            <p className="text-sm text-gray-600">
              Reach out through the form and we'll call you back at a time that suits you.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}