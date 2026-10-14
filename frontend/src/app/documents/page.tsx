import type { Metadata } from "next";
import { apiGet, mediaUrl } from "@/lib/api";
import type { Paginated } from "@/types/cms";
import { PageBanner } from "@/components/layout/PageBanner";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Documents",
  description:
    "Product data sheets, certifications, and technical documentation.",
};

type Document = {
  id: number;
  title: string;
  description: string;
  file: string;
  order: number;
  uploaded_at: string;
};

export default async function DocumentsPage() {
  let documents: Document[] = [];
  try {
    const res = await apiGet<Paginated<Document>>("/documents/?page_size=200", {
      revalidate: 300,
      tags: ["documents"],
    });
    documents = res.results;
  } catch (err) {
    console.error("[documents] fetch failed:", err);
  }

  return (
    <>
      <PageBanner
        eyebrow="Resources"
        title="Documents"
        description="Product data sheets, certifications, and technical documentation."
        image="/hero-documents.jpg"
        breadcrumbs={[{ label: "Documents" }]}
      />

      <div className="container-site py-16">
        {!documents.length && (
          <div className="text-center py-16 text-gray-500">
            No public documents available yet.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={mediaUrl(doc.file)}
              target="_blank"
              rel="noopener noreferrer"
              className="group card hover-lift p-6 flex items-start gap-4"
            >
              <div
                className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(11,61,145,0.08)",
                  color: "var(--color-primary)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {doc.title}
                </h2>
                {doc.description && (
                  <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-2">
                    {doc.description}
                  </p>
                )}
                <span
                  className="text-xs font-semibold inline-flex items-center gap-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  Download
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}