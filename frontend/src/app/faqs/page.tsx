import type { Metadata } from "next";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { FAQ, Paginated } from "@/types/cms";
import { PageBanner } from "@/components/layout/PageBanner";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about our oils, shipping, and certifications.",
};

export default async function FAQPage() {
  let faqs: FAQ[] = [];
  try {
    const res = await apiGet<Paginated<FAQ>>("/faqs/?page_size=100", {
      revalidate: 300,
      tags: ["faqs"],
    });
    faqs = res.results;
  } catch (err) {
    console.error("[faqs] fetch failed:", err);
  }

  const grouped = faqs.reduce<Record<string, FAQ[]>>((acc, f) => {
    (acc[f.category] ??= []).push(f);
    return acc;
  }, {});

  const labels: Record<string, string> = {
    general: "General",
    products: "Products",
    shipping: "Shipping",
    quality: "Quality",
    other: "Other",
  };

  return (
    <>
      <PageBanner
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Answers to the questions we hear most. Still unsure? Contact us — we respond within one business day."
        image="/hero-faqs.jpg"
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <div className="container-site py-16 max-w-3xl">
        {!faqs.length && (
          <div className="text-center py-16 text-gray-500">
            No FAQs published yet.
          </div>
        )}

        {Object.entries(grouped).map(([category, list]) => (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              {labels[category] ?? category}
            </h2>
            <div className="space-y-3">
              {list.map((f) => (
                <details
                  key={f.id}
                  className="group bg-white rounded-lg border border-[var(--color-border)] open:shadow-md transition-shadow"
                >
                  <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4 font-semibold">
                    {f.question}
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-lg leading-none group-open:rotate-45 transition-transform"
                      style={{
                        background: "rgba(11,61,145,0.08)",
                        color: "var(--color-primary)",
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-0 text-[var(--color-muted)] leading-relaxed">
                    {f.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div
          className="mt-16 p-8 rounded-lg text-center"
          style={{ background: "var(--color-surface)" }}
        >
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-[var(--color-muted)] mb-6">
            Our team is happy to help with technical specifications, availability,
            and pricing.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}