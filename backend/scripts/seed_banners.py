"""
Seed a PageBanner row for each built-in frontend page.
Idempotent — safe to run multiple times.

Usage:
    python scripts/seed_banners.py
"""

import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402
django.setup()

from apps.core.models import PageBanner  # noqa: E402


BANNERS = [
    {
        "key": "products",
        "title": "Products listing",
        "eyebrow": "Product Catalogue",
        "heading": "Our Products",
        "description": "Explore our range of high-performance oils and lubricants for diverse industrial needs.",
        "image": "banners/hero-products.jpg",
    },
    {
        "key": "blog",
        "title": "Blog listing",
        "eyebrow": "News & Knowledge",
        "heading": "Insights & Blog",
        "description": "Industry insights, expert guides, and the latest from Premium Oil.",
        "image": "banners/hero-blog.jpg",
    },
    {
        "key": "industries",
        "title": "Industries listing",
        "eyebrow": "Industries We Serve",
        "heading": "Solutions for demanding environments",
        "description": "Specialized oil solutions for automotive, manufacturing, food, energy, and marine.",
        "image": "banners/hero-industries.jpg",
    },
    {
        "key": "contact",
        "title": "Contact page",
        "eyebrow": "Get in Touch",
        "heading": "Contact Us",
        "description": "We're here to help. Get in touch with our team for product enquiries, quotes, or technical support.",
        "image": "banners/hero-contact.jpg",
    },
    {
        "key": "request-quote",
        "title": "Request a quote page",
        "eyebrow": "Get Pricing",
        "heading": "Request a Quote",
        "description": "Tell us your requirements and our team will prepare a tailored quote within one business day.",
        "image": "banners/hero-quote.jpg",
    },
    {
        "key": "faqs",
        "title": "FAQs page",
        "eyebrow": "Support",
        "heading": "Frequently Asked Questions",
        "description": "Answers to the questions we hear most. Still unsure? Contact us — we respond within one business day.",
        "image": "banners/hero-faqs.jpg",
    },
    {
        "key": "documents",
        "title": "Documents page",
        "eyebrow": "Resources",
        "heading": "Documents",
        "description": "Product data sheets, certifications, and technical documentation.",
        "image": "banners/hero-documents.jpg",
    },
]


def main():
    created = 0
    for data in BANNERS:
        obj, made = PageBanner.objects.get_or_create(
            key=data["key"],
            defaults={
                "title": data["title"],
                "eyebrow": data["eyebrow"],
                "heading": data["heading"],
                "description": data["description"],
                "image": data["image"],
                "is_active": True,
            },
        )
        if made:
            created += 1
            print(f"  ✓ {data['key']}")
        else:
            print(f"  • {data['key']} exists — skipped")
    print(f"\nDone. {created} created, {len(BANNERS) - created} existing.")


if __name__ == "__main__":
    main()