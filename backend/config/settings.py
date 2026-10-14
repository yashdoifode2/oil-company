"""
Django settings — Premium Oil Business Website backend.
"""

from datetime import timedelta
from pathlib import Path
import environ


# ---------------------------------------------------------------------------
# Paths & environment
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DJANGO_DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

SECRET_KEY = env("DJANGO_SECRET_KEY", default="unsafe-dev-key-change-me")
DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

CSRF_TRUSTED_ORIGINS = env.list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    default=["http://localhost:3000", "http://127.0.0.1:3000"],
)

SITE_URL = env("SITE_URL", default="http://localhost:3000")


# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------

INSTALLED_APPS = [

    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sitemaps",

    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    "taggit",

    "apps.core",
    "apps.pages",
    "apps.homepage",
    "apps.navigation",
    "apps.products",
    "apps.blog",
    "apps.industries",
    "apps.testimonials",
    "apps.faqs",
    "apps.documents",
    "apps.inquiries",
    "apps.seo",
    "apps.users",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ---------------------------------------------------------------------------
# Database — SQLite3
# ---------------------------------------------------------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / env("SQLITE_PATH", default="db.sqlite3"),
        "OPTIONS": {
            "timeout": 20,
        },
    }
}


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

AUTH_USER_MODEL = "users.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LOGIN_URL = "/admin/login/"
LOGIN_REDIRECT_URL = "/admin/"
LOGOUT_REDIRECT_URL = "/admin/login/"


# ---------------------------------------------------------------------------
# i18n
# ---------------------------------------------------------------------------

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# ---------------------------------------------------------------------------
# Static & media
# ---------------------------------------------------------------------------

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"] if (BASE_DIR / "static").exists() else []

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ---------------------------------------------------------------------------
# DRF
# ---------------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Premium Oil Business Website API",
    "DESCRIPTION": "CMS + public API.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
}


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=["http://localhost:3000", "http://127.0.0.1:3000"],
)
CORS_ALLOW_CREDENTIALS = True


# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------

EMAIL_BACKEND = env("EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = env("EMAIL_HOST", default="")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="no-reply@example.com")


# ---------------------------------------------------------------------------
# Cache
# ---------------------------------------------------------------------------

REDIS_URL = env("REDIS_URL", default="")

if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "premium-oil-default",
        }
    }


# ---------------------------------------------------------------------------
# Security (when DEBUG=False)
# ---------------------------------------------------------------------------

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "same-origin"
    X_FRAME_OPTIONS = "DENY"
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "[{asctime}] {levelname} {name} {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},
    },
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "django": {"handlers": ["console"], "level": "INFO", "propagate": False},
        "apps": {"handlers": ["console"], "level": "INFO", "propagate": False},
    },
}


# ---------------------------------------------------------------------------
# SQLite pragmas (applied per connection)
# ---------------------------------------------------------------------------

from django.db.backends.signals import connection_created  # noqa: E402


def _sqlite_pragmas(sender, connection, **kwargs):
    if connection.vendor != "sqlite":
        return
    with connection.cursor() as cur:
        cur.execute("PRAGMA journal_mode=WAL;")
        cur.execute("PRAGMA synchronous=NORMAL;")
        cur.execute("PRAGMA foreign_keys=ON;")


connection_created.connect(_sqlite_pragmas)

# ---------------------------------------------------------------------------
# Jazzmin — professional Django admin theme
# ---------------------------------------------------------------------------

JAZZMIN_SETTINGS = {
    # Window title + header branding
    "site_title": "Premium Oil Admin",
    "site_header": "Premium Oil",
    "site_brand": "Premium Oil CMS",
    "site_logo": None,  # set to a static path like "images/logo.png" when you have one
    "site_logo_classes": "img-circle",
    "site_icon": None,
    "welcome_sign": "Welcome to the Premium Oil content management system",
    "copyright": "Premium Oil Co.",

    # Top search bar — models the owner will search often
    "search_model": ["products.Product", "blog.Article", "pages.Page", "inquiries.Inquiry"],

    # Top-right user menu
    "user_avatar": None,

    # Sidebar order and grouping
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": [
        "core",
        "homepage",
        "pages",
        "navigation",
        "products",
        "blog",
        "industries",
        "testimonials",
        "faqs",
        "documents",
        "inquiries",
        "seo",
        "users",
        "auth",
    ],

    # Icons for apps and models — Font Awesome 5/6 class names
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",

        "users": "fas fa-user-shield",
        "users.User": "fas fa-user-shield",

        "core": "fas fa-cogs",
        "core.CompanyProfile": "fas fa-building",
        "core.SiteSettings": "fas fa-globe",
        "core.ThemeSettings": "fas fa-palette",
        "core.SocialLink": "fas fa-share-alt",
        "core.MediaAsset": "fas fa-photo-video",

        "homepage": "fas fa-home",
        "homepage.HomepageSection": "fas fa-th-large",

        "pages": "fas fa-file-alt",
        "pages.Page": "fas fa-file-alt",
        "pages.PageSection": "fas fa-puzzle-piece",

        "navigation": "fas fa-bars",
        "navigation.MenuItem": "fas fa-link",
        "navigation.HeaderSettings": "fas fa-heading",
        "navigation.FooterSettings": "fas fa-shoe-prints",
        "navigation.FooterColumn": "fas fa-columns",
        "navigation.FooterLink": "fas fa-link",

        "products": "fas fa-oil-can",
        "products.Product": "fas fa-oil-can",
        "products.ProductCategory": "fas fa-tags",
        "products.ProductImage": "fas fa-image",
        "products.ProductDocument": "fas fa-file-pdf",

        "blog": "fas fa-newspaper",
        "blog.Article": "fas fa-newspaper",
        "blog.BlogCategory": "fas fa-folder",

        "industries": "fas fa-industry",
        "industries.Industry": "fas fa-industry",

        "testimonials": "fas fa-quote-right",
        "testimonials.Testimonial": "fas fa-quote-right",

        "faqs": "fas fa-question-circle",
        "faqs.FAQ": "fas fa-question-circle",

        "documents": "fas fa-file-pdf",
        "documents.Document": "fas fa-file-pdf",

        "inquiries": "fas fa-envelope-open-text",
        "inquiries.Inquiry": "fas fa-envelope-open-text",

        "seo": "fas fa-search",
        "seo.Redirect": "fas fa-exchange-alt",

        "taggit": "fas fa-tags",
        "taggit.Tag": "fas fa-tag",
        "taggit.TaggedItem": "fas fa-tag",
    },

    "default_icon_parents": "fas fa-folder",
    "default_icon_children": "fas fa-circle",

    # UI behavior
    "related_modal_active": True,
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": False,
    "show_ui_builder": False,

    # Change form layout
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs",
        "core.CompanyProfile": "collapsible",
        "core.SiteSettings": "collapsible",
        "core.ThemeSettings": "collapsible",
        "products.Product": "horizontal_tabs",
        "blog.Article": "horizontal_tabs",
        "pages.Page": "horizontal_tabs",
        "inquiries.Inquiry": "collapsible",
    },

    # Optional: top menu links (like a real admin header)
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "View site", "url": "/", "new_window": True},
        {
            "name": "API Docs",
            "url": "/api/docs/",
            "new_window": True,
            "icon": "fas fa-book",
        },
        {
            "name": "Inquiries",
            "url": "/admin/inquiries/inquiry/",
            "icon": "fas fa-envelope",
        },
    ],

    # Optional: usermenu links
    "usermenu_links": [
        {
            "name": "Support",
            "url": "mailto:support@premiumoil.example",
            "new_window": True,
            "icon": "fas fa-life-ring",
        },
        {"model": "auth.user"},
    ],
}


JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-dark",
    "accent": "accent-primary",
    "navbar": "navbar-dark",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": True,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "default",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
}