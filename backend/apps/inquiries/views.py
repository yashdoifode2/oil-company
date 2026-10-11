import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response

from .models import Inquiry
from .serializers import InquiryCreateSerializer

logger = logging.getLogger("apps.inquiries")


class InquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquiryCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()

        try:
            send_mail(
                subject=f"New inquiry from {inquiry.name}",
                message=(
                    f"Name: {inquiry.name}\n"
                    f"Email: {inquiry.email}\n"
                    f"Phone: {inquiry.phone}\n"
                    f"Company: {inquiry.company}\n"
                    f"Product: {inquiry.product_of_interest}\n"
                    f"Quantity: {inquiry.quantity}\n\n"
                    f"{inquiry.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=False,
            )
            inquiry.email_notified = True
            inquiry.email_error = ""
        except Exception as exc:  # noqa: BLE001
            inquiry.email_notified = False
            inquiry.email_error = str(exc)
            logger.exception("Inquiry email failed for #%s", inquiry.pk)

        inquiry.save(update_fields=["email_notified", "email_error"])
        return Response({"id": inquiry.pk, "status": "received"}, status=201)