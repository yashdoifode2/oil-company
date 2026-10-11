import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet, mediaUrl } from "@/lib/api";
import type { ProductDetail } from "@/types/cms";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await loadProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.seo_title || p.name,
    description: p.meta_description || p.short_description,
    openGraph: p.og_image ? { images: [mediaUrl(p.og_image)] } : undefined,
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const specs = Object.entries(product.specifications ?? {});

  return (
    <div className="container-site py-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          ...(product.category
            ? [{ label: product.category.name, href: `/products?category__slug=${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />
      <div className="grid lg:grid-cols-2 gap-12">
        <ProductGallery
          main={product.main_image}
          mainAlt={product.image_alt || product.name}
          images={product.images}
        />
        <div>
          {product.category && (
            <div
              className="text-xs uppercase tracking-wide font-semibold mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              {product.category.name}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          {product.short_description && (
            <p className="text-lg text-gray-700 mb-6">{product.short_description}</p>
          )}
          {product.availability && (
            <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded text-sm mb-6">
              {product.availability}
            </div>
          )}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button href={`/contact?product=${encodeURIComponent(product.name)}`} size="lg">
              Request a Quote
            </Button>
            <Button href="/products" variant="outline" size="lg">
              Back to Catalog
            </Button>
          </div>
          {specs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Specifications</h2>
              <table className="w-full text-sm border rounded overflow-hidden">
                <tbody>
                  {specs.map(([key, value], i) => (
                    <tr key={key} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                      <th className="text-left px-4 py-2 font-medium w-1/2">{key}</th>
                      <td className="px-4 py-2">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {product.applications && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Applications</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.applications}</p>
            </div>
          )}
          {product.packaging_options && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Packaging Options</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.packaging_options}</p>
            </div>
          )}
        </div>
      </div>

      {product.full_description && (
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <RichText html={product.full_description} />
        </div>
      )}

      {product.documents.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Technical Documents</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.documents.map((doc) => (
              <a
                key={doc.id}
                href={mediaUrl(doc.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 border rounded hover:bg-gray-50"
              >
                <span className="text-2xl">📄</span>
                <span>
                  <span className="font-medium block">{doc.title}</span>
                  {doc.description && (
                    <span className="text-sm text-gray-600">{doc.description}</span>
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 p-8 rounded-lg text-center" style={{ background: "#f8fafc" }}>
        <h2 className="text-2xl font-bold mb-3">Need pricing or samples?</h2>
        <p className="text-gray-600 mb-6">Our team responds within one business day.</p>
        <Button href={`/contact?product=${encodeURIComponent(product.name)}`} size="lg">
          Request a Quote
        </Button>
      </div>
    </div>
  );
}