import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { FAQ, Paginated } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about our oils, shipping, and certifications.",
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
    <div className="container-site py-12 max-w-3xl">
      <Breadcrumbs items={[{ label: "FAQs" }]} />
      <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-10">
        Answers to the questions we hear most. Still unsure?{" "}
        <a href="/contact" className="underline">Contact us</a>.
      </p>
      {!faqs.length && (
        <div className="text-center py-16 text-gray-500">No FAQs published yet.</div>
      )}
      {Object.entries(grouped).map(([category, list]) => (
        <section key={category} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{labels[category] ?? category}</h2>
          <div className="divide-y border rounded-lg bg-white">
            {list.map((f) => (
              <details key={f.id} className="group p-5">
                <summary className="cursor-pointer font-semibold flex items-center justify-between">
                  {f.question}
                  <span className="group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-gray-700">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}