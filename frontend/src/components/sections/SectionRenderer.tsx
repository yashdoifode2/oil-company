import type { HomepageSection } from "@/types/cms";
import { HeroSection } from "./HeroSection";
import { TrustSection } from "./TrustSection";
import { FeaturedProductsSection } from "./FeaturedProductsSection";
import { CompanyIntroSection } from "./CompanyIntroSection";
import { IndustriesSection } from "./IndustriesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { LatestArticlesSection } from "./LatestArticlesSection";
// import { CTASection } from "./CTASection";

export function SectionRenderer({ section }: { section: HomepageSection }) {
  switch (section.section_type) {
    case "hero": return <HeroSection section={section} />;
    case "trust": return <TrustSection section={section} />;
    case "featured_products": return <FeaturedProductsSection section={section} />;
    case "company_intro": return <CompanyIntroSection section={section} />;
    case "industries": return <IndustriesSection section={section} />;
    case "testimonials": return <TestimonialsSection section={section} />;
    case "faq": return <FAQSection section={section} />;
    case "latest_articles": return <LatestArticlesSection section={section} />;
    // case "cta": return <CTASection section={section} />;
    default: return null;
  }
}