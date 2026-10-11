"use client";

import Link from "next/link";
import { useState } from "react";
import type { HeaderSettings, MenuItem } from "@/types/cms";
import { mediaUrl } from "@/lib/api";

export function Header({ header, menu }: { header: HeaderSettings; menu: MenuItem[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 z-40 bg-white">
      <div className="container-site flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3">
          {header.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(header.logo)} alt="Logo" className="h-10 w-auto" />
          ) : (
            <span className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>
              Premium Oil
            </span>
          )}
        </Link>

        <nav aria-label="Main" className="hidden md:flex items-center gap-6">
          {menu.map((item) => <DesktopItem key={item.id} item={item} />)}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {header.cta_label && header.cta_url && (
            <Link href={header.cta_url} className="btn btn-primary">
              {header.cta_label}
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-white">
          <div className="container-site py-4 flex flex-col gap-2">
            {menu.map((item) => <MobileItem key={item.id} item={item} />)}
            {header.cta_label && header.cta_url && (
              <Link href={header.cta_url} className="btn btn-primary mt-2">{header.cta_label}</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function DesktopItem({ item }: { item: MenuItem }) {
  const hasChildren = item.children.length > 0;
  if (!hasChildren) {
    return (
      <Link href={item.url || "#"} className="text-sm font-medium hover:opacity-80" style={{ color: "var(--color-text)" }}>
        {item.label}
      </Link>
    );
  }
  return (
    <div className="relative group">
      <button className="text-sm font-medium flex items-center gap-1 hover:opacity-80" style={{ color: "var(--color-text)" }}>
        {item.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute left-0 top-full pt-2 min-w-[200px] z-50">
        <div className="bg-white border rounded shadow-lg py-2">
          {item.children.map((child) => (
            <Link key={child.id} href={child.url || "#"} className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: "var(--color-text)" }}>
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileItem({ item }: { item: MenuItem }) {
  return (
    <div>
      <Link href={item.url || "#"} className="block py-2 font-medium" style={{ color: "var(--color-text)" }}>
        {item.label}
      </Link>
      {item.children.length > 0 && (
        <div className="pl-4 border-l">
          {item.children.map((child) => (
            <Link key={child.id} href={child.url || "#"} className="block py-1.5 text-sm" style={{ color: "var(--color-text)" }}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}