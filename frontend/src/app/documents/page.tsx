import type { Metadata } from "next";
import { apiGet, mediaUrl } from "@/lib/api";
import type { Paginated } from "@/types/cms";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

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
    <div className="container-site py-12">
      <Breadcrumbs items={[{ label: "Documents" }]} />
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Documents</h1>
        <p className="text-gray-600 max-w-2xl">
          Product data sheets, certifications, and technical documentation.
        </p>
      </div>

      {!documents.length && (
        <div className="text-center py-16 text-gray-500">
          No public documents are available yet.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={mediaUrl(doc.file)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-5 border rounded-lg hover:bg-gray-50 transition"
          >
            <span className="text-2xl">📄</span>
            <div>
              <h2 className="font-semibold">{doc.title}</h2>
              {doc.description && (
                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
              )}
              <span
                className="inline-block mt-2 text-xs font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Download →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}