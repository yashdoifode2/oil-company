const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || "";

export type FetchOptions = RequestInit & {
  revalidate?: number | false;
  tags?: string[];
};

export async function apiGet<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { revalidate = 60, tags, ...rest } = opts;
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(rest.headers || {}),
    },
    next: { revalidate, tags },
  });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${MEDIA_URL}${path}`;
}


export type PageBannerData = {
  key: string;
  eyebrow: string;
  heading: string;
  description: string;
  image: string | null;
  image_alt: string;
  overlay_opacity: number;
  is_active: boolean;
};

export async function getBanner(key: string): Promise<PageBannerData | null> {
  try {
    const res = await fetch(`${API_URL}/banners/${key}/`, {
      next: { revalidate: 300, tags: [`banner:${key}`] },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}