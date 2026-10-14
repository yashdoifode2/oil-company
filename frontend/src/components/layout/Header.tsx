"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { HeaderSettings, MenuItem, SocialLink } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

type Props = {
  header: HeaderSettings;
  menu: MenuItem[];
  company?: {
    phone_primary?: string;
    email?: string;
    address?: string;
    whatsapp?: string;
  } | null;
  social?: SocialLink[];
};

export function Header({ header, menu, company, social }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* ---- Top utility bar ---- */}
      <div className="hidden md:block bg-[var(--color-primary)] text-white text-sm">
        <div className="container-site flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            {company?.phone_primary && (
              <a href={`tel:${company.phone_primary.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:opacity-80 !text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.07 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.09a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2z"/></svg>
                {company.phone_primary}
              </a>
            )}
            {company?.email && (
              <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:opacity-80 !text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {company.email}
              </a>
            )}
            {company?.address && (
              <span className="hidden lg:flex items-center gap-1.5 opacity-90">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {company.address.split(",")[0]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {social && social.length > 0 && (
              <div className="flex items-center gap-3">
                {social.slice(0, 4).map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 !text-white text-xs uppercase tracking-wide">
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
            {header.cta_label && header.cta_url && (
              <Link href={header.cta_url} className="!text-white font-semibold hover:opacity-80">
                {header.cta_label} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ---- Main header ---- */}
      <div className="container-site flex items-center justify-between h-16 md:h-20 gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {header.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(header.logo)} alt="Logo" className="h-10 md:h-12 w-auto" />
          ) : (
            <span className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
              Premium Oil
            </span>
          )}
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {menu.map((item) => (
            <DesktopItem key={item.id} item={item} active={pathname === item.url} />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/request-quote" className="btn btn-navy">
            Request a Quote
          </Link>
        </div>

        <button
          className="lg:hidden p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></>}
          </svg>
        </button>
      </div>

      {/* ---- Mobile menu ---- */}
      {mobileOpen && (
        <nav className="lg:hidden border-t bg-white">
          <div className="container-site py-4 flex flex-col gap-1">
            {menu.map((item) => (
              <MobileItem key={item.id} item={item} onNavigate={() => setMobileOpen(false)} />
            ))}
            <Link href="/request-quote" className="btn btn-navy mt-3" onClick={() => setMobileOpen(false)}>
              Request a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function DesktopItem({ item, active }: { item: MenuItem; active: boolean }) {
  const hasChildren = item.children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        href={item.url || "#"}
        className={`px-3.5 py-2 text-[0.9375rem] font-medium rounded-md transition-colors ${
          active ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5" : "text-[var(--color-text)] hover:text-[var(--color-primary)]"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button className="px-3.5 py-2 text-[0.9375rem] font-medium flex items-center gap-1 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-md">
        {item.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-0 top-full pt-2 min-w-[240px] z-50">
        <div className="bg-white border rounded-lg shadow-lg py-2">
          {item.children.map((child) => (
            <Link key={child.id} href={child.url || "#"} className="block px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)]">
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileItem({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  return (
    <div>
      <Link href={item.url || "#"} className="block py-2.5 font-medium text-[var(--color-text)]" onClick={onNavigate}>
        {item.label}
      </Link>
      {item.children.length > 0 && (
        <div className="pl-4 border-l ml-1">
          {item.children.map((child) => (
            <Link key={child.id} href={child.url || "#"} className="block py-2 text-sm text-[var(--color-muted)]" onClick={onNavigate}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}