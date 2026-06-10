from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer, CartItemSerializer


class CartViewSet(viewsets.GenericViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def list(self, request):
        cart = self.get_object()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def add_item(self, request):
        cart = self.get_object()
        product = get_object_or_404(Product, id=request.data.get("product_id"))
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product,
            defaults={"quantity": request.data.get("quantity", 1)},
        )
        if not created:
            item.quantity += int(request.data.get("quantity", 1))
            item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def update_item(self, request):
        cart = self.get_object()
        item = get_object_or_404(CartItem, id=request.data.get("item_id"), cart=cart)
        item.quantity = request.data.get("quantity", item.quantity)
        if item.quantity <= 0:
            item.delete()
        else:
            item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def remove_item(self, request):
        cart = self.get_object()
        CartItem.objects.filter(id=request.data.get("item_id"), cart=cart).delete()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def clear(self, request):
        cart = self.get_object()
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)
