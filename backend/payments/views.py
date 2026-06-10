import json
import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order, OrderItem
from accounts.models import User


stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session.get("metadata", {}).get("order_id")
        if order_id:
            order = Order.objects.get(id=order_id)
            order.status = Order.Status.PAID
            order.stripe_session_id = session["id"]
            order.save()
            Payment.objects.create(
                user=order.user,
                order=order,
                stripe_payment_intent_id=session.get("payment_intent", ""),
                amount=session["amount_total"] / 100,
                status=Payment.Status.COMPLETED,
            )

    elif event["type"] == "invoice.paid":
        invoice = event["data"]["object"]
        customer_id = invoice.get("customer")
        if customer_id:
            user = User.objects.filter(stripe_customer_id=customer_id).first()
            if user:
                order = Order.objects.create(
                    user=user,
                    status=Order.Status.PAID,
                    total=invoice["amount_paid"] / 100,
                )
                Payment.objects.create(
                    user=user,
                    order=order,
                    stripe_payment_intent_id=invoice.get("payment_intent", ""),
                    amount=invoice["amount_paid"] / 100,
                    status=Payment.Status.COMPLETED,
                )

    elif event["type"] == "customer.subscription.deleted":
        pass

    return Response({"status": "ok"})
