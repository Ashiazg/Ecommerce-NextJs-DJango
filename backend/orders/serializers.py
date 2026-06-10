from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "status", "total",
            "stripe_session_id", "items", "created_at", "updated_at",
        ]
        read_only_fields = ["user", "stripe_session_id", "created_at", "updated_at"]
