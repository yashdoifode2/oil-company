from django.urls import path

from .views import navigation_bootstrap

urlpatterns = [
    path("navigation/", navigation_bootstrap, name="navigation-bootstrap"),
]