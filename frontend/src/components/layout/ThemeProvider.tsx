import type { ThemeSettings } from "@/types/cms";

const RADIUS: Record<ThemeSettings["radius_preset"], string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
};

const WIDTH: Record<ThemeSettings["content_width"], string> = {
  narrow: "880px",
  default: "1200px",
  wide: "1440px",
};

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeSettings | null;
  children: React.ReactNode;
}) {
  const vars = theme
    ? {
        "--color-primary": theme.primary_color,
        "--color-secondary": theme.secondary_color,
        "--color-accent": theme.accent_color,
        "--color-background": theme.background_color,
        "--color-text": theme.text_color,
        "--color-button": theme.button_color,
        "--color-button-text": theme.button_text_color,
        "--color-link": theme.link_color,
        "--radius": RADIUS[theme.radius_preset],
        "--content-width": WIDTH[theme.content_width],
        "--font-heading": `"${theme.heading_font}", ui-sans-serif, system-ui, sans-serif`,
        "--font-body": `"${theme.body_font}", ui-sans-serif, system-ui, sans-serif`,
      }
    : {};

  return (
    <div style={vars as React.CSSProperties}>
      {children}
    </div>
  );
}