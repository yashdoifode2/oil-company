import Link from "next/link";
import type { SiteSettings } from "@/types/cms";

export function AnnouncementBar({ site }: { site: SiteSettings }) {
  if (!site.announcement_visible || !site.announcement_text) return null;

  const content = (
    <p className="text-sm font-medium">{site.announcement_text}</p>
  );

  return (
    <div
      className="w-full py-2 px-4 text-center"
      style={{ background: "var(--color-primary)", color: "#fff" }}
    >
      {site.announcement_url ? (
        <Link href={site.announcement_url} className="hover:underline" style={{ color: "#fff" }}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}