import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet, mediaUrl } from "@/lib/api";
import type { ProductDetail } from "@/types/cms";
import { ProductGallery } from "@/components/products/ProductGallery";
import { PageBanner } from "@/components/layout/PageBanner";
import { RichText } from "@/components/ui/RichText";

export const revalidate = 120;

type Params = Promise<{ slug: string }>;

async function loadProduct(slug: string): Promise<ProductDetail | null> {
  try {
    return await apiGet<ProductDetail>(`/products/${slug}/`, {
      revalidate: 120,
      tags: [`product:${slug}`, "products"],
    });
  } catch (err) {
    console.error(`[product:${slug}] load failed:`, err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await loadProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.seo_title || p.name,
    description: p.meta_description || p.short_description,
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const specs = Object.entries(product.specifications ?? {});

  return (
    <>
      <PageBanner
        eyebrow={product.category?.name || "Product"}
        title={product.name}
        image="/hero-products.jpg"
        breadcrumbs={[
          { label: "Products", href: "/products" },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/products?category__slug=${product.category.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
        size="compact"
      />

      <section className="container-site py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery
            main={product.main_image}
            mainAlt={product.image_alt || product.name}
            images={product.images}
          />

          <div>
            {product.category && (
              <div
                className="text-xs uppercase tracking-[0.14em] font-bold mb-3"
                style={{ color: "var(--color-primary)" }}
              >
                {product.category.name}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
            {product.hero_tagline && (
              <p
                className="text-sm uppercase tracking-wide font-semibold mb-4"
                style={{ color: "var(--color-secondary)" }}
              >
                {product.hero_tagline}
              </p>
            )}
            <p className="text-lg text-[var(--color-muted)] mb-6">
              {product.short_description}
            </p>

            {specs.length > 0 && (
              <div className="mb-6 grid grid-cols-2 gap-3">
                {specs.slice(0, 4).map(([k, v]) => (
                  <div
                    key={k}
                    className="text-sm border-l-2 border-[var(--color-primary)] pl-3"
                  >
                    <div className="text-[var(--color-muted)] text-xs uppercase tracking-wide">
                      {k}
                    </div>
                    <div className="font-semibold">{String(v)}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href={`/request-quote?product=${encodeURIComponent(product.name)}`}
                className="btn btn-primary btn-lg"
              >
                Request a Quote
              </Link>
              {product.documents.length > 0 && (
                <a
                  href={mediaUrl(product.documents[0].file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  Download TDS ↓
                </a>
              )}
            </div>

            {product.availability && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-800 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {product.availability}
              </div>
            )}
          </div>
        </div>

        <div className="border-b mb-8">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {["Overview", "Specifications", "Packaging", "Documents"].map(
              (tab, i) => (
                <span
                  key={tab}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${
                    i === 0
                      ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                      : "text-[var(--color-muted)] border-transparent"
                  }`}
                >
                  {tab}
                </span>
              )
            )}
          </nav>
        </div>

        <div className="max-w-3xl">
          {product.full_description && <RichText html={product.full_description} />}

          {specs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Full Specifications</h2>
              <table className="w-full text-sm border rounded overflow-hidden">
                <tbody>
                  {specs.map(([key, value], i) => (
                    <tr
                      key={key}
                      className={i % 2 ? "bg-[var(--color-surface)]" : "bg-white"}
                    >
                      <th className="text-left px-4 py-2.5 font-medium w-1/2">
                        {key}
                      </th>
                      <td className="px-4 py-2.5">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.packaging_options && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Packaging Options</h2>
              <p className="text-[var(--color-muted)] whitespace-pre-line">
                {product.packaging_options}
              </p>
            </div>
          )}

          {product.documents.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Technical Documents</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {product.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={mediaUrl(doc.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-[var(--color-surface)]"
                  >
                    <span className="text-xl">📄</span>
                    <span>
                      <span className="font-medium block">{doc.title}</span>
                      {doc.description && (
                        <span className="text-sm text-[var(--color-muted)]">
                          {doc.description}
                        </span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 p-8 rounded-lg text-center bg-[var(--color-surface)]">
          <h2 className="text-2xl font-bold mb-3">Need pricing or samples?</h2>
          <p className="text-[var(--color-muted)] mb-6">
            Our team responds within one business day.
          </p>
          <Link
            href={`/request-quote?product=${encodeURIComponent(product.name)}`}
            className="btn btn-primary btn-lg"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}