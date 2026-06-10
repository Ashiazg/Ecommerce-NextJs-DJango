"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/use-orders";
import { Card, Badge, Button } from "@/components/ui";
import AuthGuard from "@/components/AuthGuard";

function OrderDetailContent() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(Number(id));

  if (isLoading) return <p className="text-text-muted">Cargando...</p>;
  if (error || !order) return <p className="text-red-500">Orden no encontrada</p>;

  return (
    <div>
      <Button href="/orders" variant="ghost" className="mb-4">&larr; Mis Órdenes</Button>
      <Card>
        <Card.Header className="flex items-center justify-between">
          <span>Orden #{order.id}</span>
          <Badge variant={"success"}>{order.status}</Badge>
        </Card.Header>
        <Card.Body className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-text">{item.product_name} x{item.quantity}</span>
              <span className="font-medium">${item.price}</span>
            </div>
          ))}
          <hr className="border-border" />
          <div className="flex justify-between font-bold text-text">
            <span>Total</span>
            <span>${order.total}</span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <OrderDetailContent />
    </AuthGuard>
  );
}
