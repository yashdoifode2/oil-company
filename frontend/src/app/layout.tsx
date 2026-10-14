import type { Metadata } from "next";
import "./globals.css";

import { apiGet } from "@/lib/api";
import type { NavigationBootstrap, SiteBootstrap } from "@/types/cms";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FloatingContact } from "@/components/layout/FloatingContact";

async function loadChrome() {
  try {
    const [site, nav] = await Promise.all([
      apiGet<SiteBootstrap>("/site/", { revalidate: 300, tags: ["site"] }),
      apiGet<NavigationBootstrap>("/navigation/", { revalidate: 300, tags: ["navigation"] }),
    ]);
    return { site, nav };
  } catch {
    return { site: null, nav: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await loadChrome();
  const title = site?.site.default_meta_title || site?.company.business_name || "Premium Oil";
  const description = site?.site.default_meta_description || "";
  return {
    title: {
      default: title,
      template: `%s · ${site?.site.site_name ?? "Premium Oil"}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    robots: site?.site.allow_indexing === false ? { index: false } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site, nav } = await loadChrome();
  const company = site?.company;

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={site?.theme ?? null}>
          {site && <AnnouncementBar site={site.site} />}
          {nav && (
            <Header
              header={nav.header}
              menu={nav.menu}
              company={company ?? null}
              social={site?.social ?? []}
            />
          )}
          <main className="min-h-[60vh]">{children}</main>
          {nav && (
            <Footer settings={nav.footer.settings} columns={nav.footer.columns} site={site} />
          )}
          {company && (
            <FloatingContact
              phone={company.phone_primary}
              email={company.email}
              whatsapp={company.whatsapp}
              hours={company.business_hours}
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}