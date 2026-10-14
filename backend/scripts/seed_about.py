"""
Rebuild the About page with professional content.
Run: python scripts/seed_about.py
"""

import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402
django.setup()

from apps.pages.models import Page, PageSection  # noqa: E402


def main():
    Page.objects.filter(slug="about").delete()

    about = Page.objects.create(
        title="About Premium Oil Co.",
        slug="about",
        short_description=(
            "Two decades of certified oil supply — trusted by manufacturers, "
            "distributors, and businesses in over 30 countries."
        ),
        content="",
        status=Page.Status.PUBLISHED,
        show_in_footer=True,
        show_in_navigation=False,
        seo_title="About Premium Oil Co. — Certified Industrial & Edible Oils",
        meta_description=(
            "Learn about Premium Oil Co.: our mission, vision, values, "
            "certifications, and two decades of supplying certified oils worldwide."
        ),
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.HERO,
        subtitle="Our Company",
        heading="Engineering trust into every drop.",
        body=(
            "<p>For over two decades, Premium Oil Co. has supplied certified "
            "industrial and edible oils to manufacturers, food processors, and "
            "energy companies across 30+ countries.</p>"
        ),
        button_text="Explore Our Products",
        button_url="/products",
        order=0,
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.STATS,
        heading="By the numbers",
        order=1,
        config={
            "items": [
                {"value": "20+",   "label": "Years in operation"},
                {"value": "30+",   "label": "Countries served"},
                {"value": "500+",  "label": "Business customers"},
                {"value": "99.4%", "label": "On-time delivery"},
            ]
        },
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.TEXT_IMAGE,
        subtitle="Our Story",
        heading="A refinery built on standards, not shortcuts.",
        body=(
            "<p>Premium Oil Co. was founded in 2004 with a simple commitment: "
            "supply certified oils that perform exactly as promised. Every batch "
            "is tested in our laboratory for purity, viscosity, and performance "
            "before it leaves our facility.</p>"
            "<p>Today, our oils keep production lines running, engines turning, "
            "and food processing safe in 30+ countries. We're still privately "
            "held, still family-run, and still testing every batch.</p>"
        ),
        order=2,
        config={"image_position": "left"},
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.MISSION_VISION,
        heading="What drives us",
        order=3,
        config={
            "mission": (
                "<p>To supply dependable, certified oils that keep industry "
                "moving and food processing safe — with full traceability from "
                "source to delivery.</p>"
            ),
            "vision": (
                "<p>To be the most trusted oil partner in every market we serve, "
                "recognized for product quality, technical integrity, and "
                "reliable logistics.</p>"
            ),
        },
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.VALUES,
        heading="Our core values",
        body="<p>The four principles that shape every decision we make.</p>",
        order=4,
        config={
            "items": [
                {
                    "title": "Quality",
                    "description": "Every batch laboratory-tested for purity, viscosity, and performance before dispatch.",
                    "icon": "Q",
                },
                {
                    "title": "Integrity",
                    "description": "We quote honestly, deliver what we promise, and stand behind every shipment.",
                    "icon": "I",
                },
                {
                    "title": "Reliability",
                    "description": "Stocked warehouses and a regional logistics network mean 24-hour dispatch on standard orders.",
                    "icon": "R",
                },
                {
                    "title": "Sustainability",
                    "description": "Recyclable packaging, efficient refining, and responsible sourcing across our supply chain.",
                    "icon": "S",
                },
            ]
        },
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.TIMELINE,
        heading="Our journey",
        order=5,
        config={
            "items": [
                {
                    "year": "2004",
                    "title": "Founded in Houston",
                    "description": "Premium Oil Co. opens its first refining and blending facility.",
                },
                {
                    "year": "2010",
                    "title": "ISO 9001 certified",
                    "description": "Our quality management system receives international certification.",
                },
                {
                    "year": "2016",
                    "title": "International expansion",
                    "description": "Distribution opens in Europe, the Middle East, and Asia-Pacific.",
                },
                {
                    "year": "2020",
                    "title": "Food-grade line launch",
                    "description": "Refined edible oils added to serve food-processing customers.",
                },
                {
                    "year": "2024",
                    "title": "30+ countries served",
                    "description": "Over 500 business customers now rely on our oils.",
                },
            ]
        },
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.CERTIFICATIONS,
        heading="Certifications & standards",
        order=6,
        config={
            "items": [
                {"name": "ISO 9001:2015", "detail": "Quality management system"},
                {"name": "ISO 14001", "detail": "Environmental management"},
                {"name": "ISO 22000", "detail": "Food safety management (edible oils)"},
                {"name": "REACH compliant", "detail": "EU chemical regulation compliance"},
                {"name": "ASTM tested", "detail": "Independent performance verification"},
                {"name": "Non-GMO verified", "detail": "For food-grade product lines"},
            ]
        },
    )

    PageSection.objects.create(
        page=about,
        section_type=PageSection.SectionType.CTA,
        heading="Let's talk about your oil requirement.",
        body="<p>Our team responds to every quote request within one business day.</p>",
        button_text="Contact Us",
        button_url="/contact",
        order=7,
    )

    print(f"✓ About page rebuilt with {about.sections.count()} sections")


if __name__ == "__main__":
    main()