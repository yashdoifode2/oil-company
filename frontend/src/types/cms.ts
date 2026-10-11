export type CompanyProfile = {
  id: number;
  business_name: string;
  legal_name: string;
  tagline: string;
  description: string;
  about_content: string;
  mission: string;
  vision: string;
  values: string;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp: string;
  address: string;
  business_hours: string;
  country: string;
  service_regions: string;
  registration_details: string;
  certifications: string;
  logo: string | null;
  logo_alt: string | null;
  favicon: string | null;
  updated_at: string;
};

export type SiteSettings = {
  site_name: string;
  site_url: string;
  default_language: string;
  default_locale: string;
  timezone: string;
  default_meta_title: string;
  default_meta_description: string;
  default_social_image: string | null;
  allow_indexing: boolean;
  announcement_text: string;
  announcement_url: string;
  announcement_visible: boolean;
  maintenance_message: string;
  maintenance_mode: boolean;
  analytics_id: string;
};

export type ThemeSettings = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  link_color: string;
  radius_preset: "none" | "sm" | "md" | "lg";
  button_style: "solid" | "outline" | "ghost";
  heading_font: string;
  body_font: string;
  content_width: "narrow" | "default" | "wide";
};

export type SocialLink = {
  id: number;
  platform: string;
  url: string;
  order: number;
  is_visible: boolean;
};

export type SiteBootstrap = {
  company: CompanyProfile;
  site: SiteSettings;
  theme: ThemeSettings;
  social: SocialLink[];
};

export type MenuItem = {
  id: number;
  label: string;
  url: string;
  order: number;
  is_visible: boolean;
  open_in_new_tab: boolean;
  children: MenuItem[];
};

export type HeaderSettings = {
  logo: string | null;
  mobile_logo: string | null;
  cta_label: string;
  cta_url: string;
};

export type FooterLink = {
  id: number;
  label: string;
  url: string;
  order: number;
  is_visible: boolean;
  open_in_new_tab: boolean;
};

export type FooterColumn = {
  id: number;
  title: string;
  order: number;
  is_visible: boolean;
  links: FooterLink[];
};

export type FooterSettings = {
  description: string;
  copyright_text: string;
  show_newsletter: boolean;
};

export type NavigationBootstrap = {
  header: HeaderSettings;
  menu: MenuItem[];
  footer: {
    settings: FooterSettings;
    columns: FooterColumn[];
  };
};

export type HomepageSection = {
  id: number;
  section_type: string;
  title: string;
  subtitle: string;
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  main_image: string | null;
  background_image: string | null;
  mobile_image: string | null;
  image_alt: string;
  text_alignment: "left" | "center" | "right";
  overlay_opacity: number;
  background_style: string;
  order: number;
  is_visible: boolean;
  config: Record<string, unknown>;
  updated_at: string;
};

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  order: number;
};

export type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory | null;
  short_description: string;
  main_image: string | null;
  is_featured: boolean;
};

export type ProductDetail = ProductListItem & {
  full_description: string;
  image_alt: string;
  specifications: Record<string, string>;
  applications: string;
  packaging_options: string;
  availability: string;
  images: { id: number; image: string; alt_text: string; order: number }[];
  documents: { id: number; title: string; file: string; description: string }[];
  seo_title: string;
  meta_description: string;
  updated_at: string;
};

export type ArticleListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  image_alt: string;
  category: ProductCategory | null;
  author_name: string | null;
  published_at: string | null;
};

export type ArticleDetail = ArticleListItem & {
  body: string;
  tags: string[];
};

export type Industry = {
  id: number;
  name: string;
  slug: string;
  description: string;
  technical_information: string;
  featured_image: string | null;
  image_alt: string;
  seo_title: string;
  meta_description: string;
};

export type Testimonial = {
  id: number;
  customer_name: string;
  company: string;
  text: string;
  image: string | null;
  order: number;
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
};

export type PageListItem = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image: string | null;
  updated_at: string;
};

export type PageSection = {
  id: number;
  section_type: string;
  title: string;
  subtitle: string;
  heading: string;
  body: string;
  image: string | null;
  image_alt: string;
  button_text: string;
  button_url: string;
  order: number;
  is_visible: boolean;
  config: Record<string, unknown>;
};

export type PageDetail = PageListItem & {
  content: string;
  seo_title: string;
  meta_description: string;
  sections: PageSection[];
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};