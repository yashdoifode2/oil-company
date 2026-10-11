from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Public API
    path("api/", include("apps.core.urls")),
    path("api/", include("apps.navigation.urls")),
    path("api/", include("apps.homepage.urls")),
    path("api/", include("apps.pages.urls")),
    path("api/", include("apps.products.urls")),
    path("api/", include("apps.blog.urls")),
    path("api/", include("apps.industries.urls")),
    path("api/", include("apps.testimonials.urls")),
    path("api/", include("apps.faqs.urls")),
    path("api/", include("apps.documents.urls")),
    path("api/", include("apps.inquiries.urls")),
    path("api/", include("apps.seo.urls")),

    # OpenAPI schema + docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)