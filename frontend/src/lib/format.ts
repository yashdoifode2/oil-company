export function formatDate(input: string | null | undefined): string {
  if (!input) return "";
  try {
    return new Date(input).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

export function excerpt(text: string, max = 140): string {
  if (!text) return "";
  const stripped = text.replace(/<[^>]*>/g, "").trim();
  return stripped.length > max ? `${stripped.slice(0, max).trimEnd()}…` : stripped;
}