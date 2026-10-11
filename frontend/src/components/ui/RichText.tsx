export function RichText({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={`prose prose-slate max-w-none ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}