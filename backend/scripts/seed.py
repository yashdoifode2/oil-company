"""
Seed initial CMS data for the Premium Oil Business Website.

Usage (from backend/, with venv active):
    python scripts/seed.py

Idempotent — safe to run multiple times. Existing singleton rows are
updated only if they're empty; existing menu items and sections are
left alone unless they don't exist yet.
"""

import os
import sys
from pathlib import Path

# Ensure `backend/` is on sys.path and Django settings are configured
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402

django.setup()

from django.utils import timezone  # noqa: E402

from apps.blog.models import Article, BlogCategory  # noqa: E402
from apps.core.models import (  # noqa: E402
    CompanyProfile,
    SiteSettings,
    SocialLink,
    ThemeSettings,
)
from apps.faqs.models import FAQ  # noqa: E402
from apps.homepage.models import HomepageSection  # noqa: E402
from apps.industries.models import Industry  # noqa: E402
from apps.navigation.models import (  # noqa: E402
    FooterColumn,
    FooterLink,
    FooterSettings,
    HeaderSettings,
    MenuItem,
)
from apps.products.models import Product, ProductCategory  # noqa: E402
from apps.testimonials.models import Testimonial  # noqa: E402


# ---------------------------------------------------------------------------
# Company / site / theme
# ---------------------------------------------------------------------------

def seed_company():
    c = CompanyProfile.get_solo()
    changed = False

    defaults = {
        "business_name": "Premium Oil Co.",
        "legal_name": "Premium Oil Company Ltd.",
        "tagline": "Refined oils for industry and life.",
        "description": (
            "Premium Oil Co. supplies high-grade industrial and edible oils "
            "to manufacturers, distributors, and businesses worldwide."
        ),
        "about_content": (
            "Founded on a commitment to quality and reliability, Premium Oil "
            "Co. delivers certified oils for automotive, manufacturing, food "
            "processing, and energy applications. Every batch is tested and "
            "traceable from source to delivery."
        ),
        "mission": "To supply dependable, certified oils that keep industry moving.",
        "vision": "To be the most trusted oil partner in every market we serve.",
        "values": "Quality. Integrity. Reliability. Sustainability.",
        "email": "info@premiumoil.example",
        "phone_primary": "+1 (555) 010-1000",
        "phone_secondary": "+1 (555) 010-1001",
        "whatsapp": "+15550101000",
        "address": "100 Refinery Road, Houston, TX 77002, United States",
        "business_hours": "Mon–Fri 08:00–18:00 · Sat 09:00–14:00",
        "country": "United States",
        "service_regions": "North America · Europe · Middle East · Asia-Pacific",
    }

    for field, value in defaults.items():
        if not getattr(c, field):
            setattr(c, field, value)
            changed = True

    if changed:
        c.save()
        print("✓ Company profile seeded")
    else:
        print("• Company profile already populated — skipped")


def seed_theme():
    t = ThemeSettings.get_solo()
    # Only set defaults if the row is essentially empty
    if t.primary_color == "#0B3D91" and t.heading_font == "Inter":
        print("• Theme settings already at defaults — skipped")
        return
    t.primary_color = "#0B3D91"
    t.secondary_color = "#F5A623"
    t.accent_color = "#1E88E5"
    t.background_color = "#FFFFFF"
    t.text_color = "#1A1A1A"
    t.button_color = "#0B3D91"
    t.button_text_color = "#FFFFFF"
    t.link_color = "#0B3D91"
    t.save()
    print("✓ Theme settings seeded")


def seed_site_settings():
    s = SiteSettings.get_solo()
    changed = False

    defaults = {
        "site_name": "Premium Oil Co.",
        "site_url": "http://localhost:3000",
        "default_language": "en",
        "default_locale": "en_US",
        "timezone": "UTC",
        "default_meta_title": "Premium Oil Co. — Refined Oils for Industry and Life",
        "default_meta_description": (
            "Certified industrial and edible oils. Trusted by manufacturers, "
            "distributors, and businesses worldwide."
        ),
        "announcement_text": "Now shipping certified ISO-grade industrial oils worldwide.",
        "announcement_url": "/products/",
        "announcement_visible": True,
    }

    for field, value in defaults.items():
        current = getattr(s, field)
        if current in ("", None, False) or (field == "site_url" and current == "http://localhost:3000" and value):
            if field == "site_url" and current == "http://localhost:3000":
                continue
            setattr(s, field, value)
            changed = True

    if changed:
        s.save()
        print("✓ Site settings seeded")
    else:
        print("• Site settings already populated — skipped")


def seed_social_links():
    links = [
        ("LinkedIn", "https://www.linkedin.com/"),
        ("X", "https://x.com/"),
        ("Facebook", "https://www.facebook.com/"),
        ("YouTube", "https://www.youtube.com/"),
    ]
    created = 0
    for i, (platform, url) in enumerate(links):
        _, made = SocialLink.objects.get_or_create(
            platform=platform,
            defaults={"url": url, "order": i, "is_visible": True},
        )
        if made:
            created += 1
    print(f"✓ Social links: {created} created, {len(links) - created} existing")


# ---------------------------------------------------------------------------
# Navigation (header + footer)
# ---------------------------------------------------------------------------

def seed_navigation():
    header, _ = HeaderSettings.objects.get_or_create(pk=1)
    if not header.cta_label:
        header.cta_label = "Request a Quote"
        header.cta_url = "/contact/"
        header.save()
        print("✓ Header settings seeded")
    else:
        print("• Header settings already populated — skipped")

    top_menu = [
        ("Home", "/", 0),
        ("Products", "/products/", 1),
        ("Industries", "/industries/", 2),
        ("About", "/about/", 3),
        ("Blog", "/blog/", 4),
        ("Contact", "/contact/", 5),
    ]
    created = 0
    for label, url, order in top_menu:
        _, made = MenuItem.objects.get_or_create(
            label=label,
            location=MenuItem.Location.HEADER,
            parent=None,
            defaults={"url": url, "order": order, "is_visible": True},
        )
        if made:
            created += 1
    print(f"✓ Header menu items: {created} created")

    footer, _ = FooterSettings.objects.get_or_create(pk=1)
    if not footer.description:
        footer.description = (
            "Premium Oil Co. supplies certified industrial and edible oils "
            "to businesses worldwide."
        )
        footer.save()
        print("✓ Footer settings seeded")

    columns = [
        ("Company", ["About Us", "Industries", "Contact", "Careers"]),
        ("Products", ["Industrial Oils", "Automotive Oils", "Edible Oils"]),
        ("Resources", ["Blog", "Documents", "FAQs"]),
    ]
    for order, (title, links) in enumerate(columns):
        col, _ = FooterColumn.objects.get_or_create(
            title=title, defaults={"order": order, "is_visible": True}
        )
        for link_order, label in enumerate(links):
            FooterLink.objects.get_or_create(
                column=col,
                label=label,
                defaults={
                    "url": "/" + label.lower().replace(" ", "-") + "/",
                    "order": link_order,
                    "is_visible": True,
                },
            )
    print("✓ Footer columns and links seeded")


# ---------------------------------------------------------------------------
# Homepage sections
# ---------------------------------------------------------------------------

def seed_homepage():
    if HomepageSection.objects.exists():
        print("• Homepage sections already exist — skipped")
        return

    sections = [
        {
            "section_type": HomepageSection.SectionType.HERO,
            "heading": "Certified oils for industry and life.",
            "subtitle": "Premium Oil Co.",
            "description": (
                "Trusted by manufacturers, distributors, and businesses in over "
                "30 countries. Every batch tested. Every delivery traceable."
            ),
            "button_text": "Browse Products",
            "button_url": "/products/",
            "secondary_button_text": "Talk to Sales",
            "secondary_button_url": "/contact/",
            "image_alt": "Refinery at golden hour",
            "text_alignment": "left",
            "order": 0,
        },
        {
            "section_type": HomepageSection.SectionType.TRUST,
            "heading": "Why businesses choose us",
            "order": 1,
            "config": {
                "items": [
                    {"title": "ISO 9001", "subtitle": "Certified quality system"},
                    {"title": "30+ Countries", "subtitle": "Global logistics"},
                    {"title": "24h Dispatch", "subtitle": "From stocked warehouses"},
                    {"title": "Full Traceability", "subtitle": "Source to delivery"},
                ]
            },
        },
        {
            "section_type": HomepageSection.SectionType.FEATURED_PRODUCTS,
            "heading": "Featured Products",
            "description": "A selection of our most-requested grades.",
            "button_text": "View All Products",
            "button_url": "/products/",
            "order": 2,
            "config": {"limit": 6, "mode": "manual", "product_ids": []},
        },
        {
            "section_type": HomepageSection.SectionType.COMPANY_INTRO,
            "heading": "Refining trust since day one.",
            "description": (
                "For over two decades, we've supplied certified oils to "
                "manufacturers, food processors, and energy companies. Our "
                "laboratories test every batch for purity, viscosity, and "
                "performance — and our logistics network delivers on time, "
                "every time."
            ),
            "button_text": "About Us",
            "button_url": "/about/",
            "order": 3,
        },
        {
            "section_type": HomepageSection.SectionType.INDUSTRIES,
            "heading": "Industries We Serve",
            "description": "Specialized oil solutions for demanding environments.",
            "order": 4,
            "config": {"limit": 6},
        },
        {
            "section_type": HomepageSection.SectionType.TESTIMONIALS,
            "heading": "What Our Clients Say",
            "order": 5,
            "config": {"limit": 3},
        },
        {
            "section_type": HomepageSection.SectionType.FAQ,
            "heading": "Frequently Asked Questions",
            "order": 6,
            "config": {"limit": 5},
        },
        {
            "section_type": HomepageSection.SectionType.LATEST_ARTICLES,
            "heading": "From the Blog",
            "description": "Industry insight, product news, and technical guides.",
            "button_text": "View All Articles",
            "button_url": "/blog/",
            "order": 7,
            "config": {"limit": 3},
        },
        {
            "section_type": HomepageSection.SectionType.CTA,
            "heading": "Ready to place an order?",
            "description": (
                "Request a quote and our team will respond within one "
                "business day."
            ),
            "button_text": "Request a Quote",
            "button_url": "/contact/",
            "order": 8,
        },
    ]
    for s in sections:
        HomepageSection.objects.create(
            section_type=s["section_type"],
            title=s.get("title", ""),
            subtitle=s.get("subtitle", ""),
            heading=s.get("heading", ""),
            description=s.get("description", ""),
            button_text=s.get("button_text", ""),
            button_url=s.get("button_url", ""),
            secondary_button_text=s.get("secondary_button_text", ""),
            secondary_button_url=s.get("secondary_button_url", ""),
            image_alt=s.get("image_alt", ""),
            text_alignment=s.get("text_alignment", "left"),
            order=s.get("order", 0),
            is_visible=True,
            config=s.get("config", {}),
        )
    print(f"✓ Homepage: {len(sections)} sections seeded")


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------

def seed_products():
    cat_data = [
        ("Industrial Oils", "Heavy-duty lubricants and hydraulic fluids for manufacturing."),
        ("Automotive Oils", "Engine oils, gear oils, and greases for vehicles."),
        ("Edible Oils", "Food-grade oils for processing and consumption."),
    ]
    cats = []
    created = 0
    for i, (name, desc) in enumerate(cat_data):
        c, made = ProductCategory.objects.get_or_create(
            name=name,
            defaults={"description": desc, "order": i, "is_visible": True},
        )
        cats.append(c)
        if made:
            created += 1
    print(f"✓ Product categories: {created} created")

    if Product.objects.exists():
        print("• Products already exist — skipped")
        return

    products = [
        {
            "name": "Hydraulic Oil HV-46",
            "category": cats[0],
            "short_description": "High-viscosity hydraulic fluid for industrial presses.",
            "specifications": {"Viscosity grade": "ISO VG 46", "Density": "0.87 g/cm³"},
            "is_featured": True,
        },
        {
            "name": "Gear Oil EP-220",
            "category": cats[0],
            "short_description": "Extreme-pressure gear oil for heavy machinery.",
            "specifications": {"Viscosity grade": "ISO VG 220", "Packaging": "20L / 200L drums"},
            "is_featured": True,
        },
        {
            "name": "Synthetic Engine Oil 5W-30",
            "category": cats[1],
            "short_description": "Full-synthetic engine oil for modern petrol and diesel engines.",
            "specifications": {"Viscosity grade": "5W-30", "API": "SN/CF"},
            "is_featured": True,
        },
        {
            "name": "Refined Sunflower Oil",
            "category": cats[2],
            "short_description": "Food-grade refined sunflower oil for industrial food processing.",
            "specifications": {"Grade": "Refined", "Packaging": "1L / 5L / 20L"},
            "is_featured": True,
        },
    ]
    for i, p in enumerate(products):
        Product.objects.create(
            name=p["name"],
            category=p["category"],
            short_description=p["short_description"],
            full_description=p["short_description"],
            specifications=p.get("specifications", {}),
            is_featured=p.get("is_featured", False),
            order=i,
            status=Product.Status.PUBLISHED,
        )
    print(f"✓ Products: {len(products)} seeded")


# ---------------------------------------------------------------------------
# Industries, Testimonials, FAQs, Blog
# ---------------------------------------------------------------------------

def seed_industries():
    if Industry.objects.exists():
        print("• Industries already exist — skipped")
        return
    data = [
        ("Automotive", "Oils engineered for engines, transmissions, and drivetrains."),
        ("Manufacturing", "Lubricants and hydraulic fluids for production lines."),
        ("Food Processing", "Food-grade oils meeting regulatory standards."),
        ("Energy", "High-performance oils for turbines and generators."),
        ("Marine", "Corrosion-resistant lubricants for vessels and ports."),
    ]
    for i, (name, desc) in enumerate(data):
        Industry.objects.create(
            name=name, description=desc, order=i, status=Industry.Status.PUBLISHED
        )
    print(f"✓ Industries: {len(data)} seeded")


def seed_testimonials():
    if Testimonial.objects.exists():
        print("• Testimonials already exist — skipped")
        return
    data = [
        ("Operations Director", "Northwind Manufacturing", "Consistent quality, on-time delivery. We've relied on them for five years."),
        ("Procurement Lead", "Greenfield Foods", "Their food-grade oils meet every audit. Documentation is always ready."),
        ("Fleet Manager", "Riverline Logistics", "Our engine oil change intervals improved by 20% since switching."),
    ]
    for i, (name, company, text) in enumerate(data):
        Testimonial.objects.create(
            customer_name=name, company=company, text=text, order=i, is_visible=True
        )
    print(f"✓ Testimonials: {len(data)} seeded")


def seed_faqs():
    if FAQ.objects.exists():
        print("• FAQs already exist — skipped")
        return
    data = [
        ("Do you supply internationally?", "Yes. We ship to over 30 countries with full documentation and customs support.", FAQ.Category.GENERAL),
        ("Are your oils certified?", "All industrial and food-grade oils carry relevant ISO and regulatory certifications.", FAQ.Category.QUALITY),
        ("What packaging options do you offer?", "1L, 5L, 20L, 200L drums, IBC totes, and bulk tanker delivery.", FAQ.Category.PRODUCTS),
        ("How fast is delivery?", "Standard orders dispatch within 24 hours from stocked warehouses.", FAQ.Category.SHIPPING),
        ("Can I request a sample?", "Yes. Contact our sales team with your requirement and we'll arrange a sample.", FAQ.Category.GENERAL),
    ]
    for i, (q, a, cat) in enumerate(data):
        FAQ.objects.create(question=q, answer=a, category=cat, order=i, is_visible=True)
    print(f"✓ FAQs: {len(data)} seeded")


def seed_blog():
    cat, _ = BlogCategory.objects.get_or_create(
        name="Industry Insight",
        defaults={"description": "Trends, standards, and technical guides.", "order": 0},
    )
    if Article.objects.exists():
        print("• Articles already exist — skipped")
        return
    articles = [
        {
            "title": "Understanding Viscosity Grades",
            "excerpt": "What ISO VG numbers actually mean and how to pick the right oil for your machinery.",
            "body": "Viscosity grade describes how thick an oil is at a given temperature. Choosing the wrong grade leads to excess wear or energy loss...",
        },
        {
            "title": "Food-Grade Oil Compliance: A Quick Guide",
            "excerpt": "Key certifications and documentation for food-processing lubricants.",
            "body": "Food-grade oils must meet strict regulatory requirements. Here are the certifications to look for...",
        },
        {
            "title": "Extending Engine Oil Change Intervals",
            "excerpt": "How modern synthetics and monitoring can stretch service windows safely.",
            "body": "Synthetic base oils and additive packages let fleets safely extend oil change intervals when supported by oil analysis...",
        },
    ]
    now = timezone.now()
    for i, a in enumerate(articles):
        Article.objects.create(
            title=a["title"],
            excerpt=a["excerpt"],
            body=a["body"],
            category=cat,
            status=Article.Status.PUBLISHED,
            published_at=now,
        )
    print(f"✓ Articles: {len(articles)} seeded")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Seeding initial CMS data…\n")
    seed_company()
    seed_theme()
    seed_site_settings()
    seed_social_links()
    seed_navigation()
    seed_homepage()
    seed_products()
    seed_industries()
    seed_testimonials()
    seed_faqs()
    seed_blog()
    print("\nDone.")


if __name__ == "__main__":
    main()