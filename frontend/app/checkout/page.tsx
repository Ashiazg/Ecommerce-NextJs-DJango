"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { Card, Button } from "@/components/ui";
import { createCheckoutSession } from "@/lib/api";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { url } = await createCheckoutSession({
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        mode: "payment",
      });
      window.location.href = url;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <Card.Body>
          <p className="text-text-muted mb-4">No hay items para pagar</p>
          <Button href="/products" variant="primary">Ver Productos</Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">Checkout</h1>

      <Card className="mb-6">
        <Card.Header>Resumen del pedido</Card.Header>
        <Card.Body className="space-y-3">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span className="text-text">{item.name} x{item.quantity}</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="border-border" />
          <div className="flex justify-between font-bold text-text">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </Card.Body>
      </Card>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <Button
        variant="primary"
        className="w-full"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Redirigiendo a Stripe..." : `Pagar $${getTotal().toFixed(2)}`}
      </Button>
      <p className="text-text-muted text-xs text-center mt-2">
        Pago seguro procesado por Stripe
      </p>
    </div>
  );
}
