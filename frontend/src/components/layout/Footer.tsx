import Link from "next/link";
import type { FooterColumn, FooterSettings, SiteBootstrap } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

export function Footer({
  settings,
  columns,
  site,
}: {
  settings: FooterSettings;
  columns: FooterColumn[];
  site: SiteBootstrap | null;
}) {
  const company = site?.company;
  const social = site?.social ?? [];
  const year = new Date().getFullYear();
  const copyright = settings.copyright_text || `© ${year} ${company?.business_name ?? "Premium Oil"}. All rights reserved.`;

  return (
    <footer className="border-t mt-16" style={{ background: "#0b1220", color: "#cbd5e1" }}>
      <div className="container-site py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          {company?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(company.logo)} alt={company.business_name} className="h-10 w-auto mb-4" />
          ) : (
            <div className="text-lg font-bold text-white mb-4">{company?.business_name ?? "Premium Oil"}</div>
          )}
          {settings.description && <p className="text-sm leading-relaxed">{settings.description}</p>}
          {social.length > 0 && (
            <div className="flex gap-3 mt-4">
              {social.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white text-sm" aria-label={s.platform}>
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {columns.map((col) => (
          <div key={col.id}>
            <h3 className="text-white font-semibold mb-3">{col.title}</h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.url || "#"} className="hover:text-white" target={link.open_in_new_tab ? "_blank" : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700">
        <div className="container-site py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>{copyright}</p>
          {company && (
            <p className="text-slate-400">
              {company.email} · {company.phone_primary}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}