"use client";

import { useOrders } from "@/hooks/use-orders";
import { Card, Badge, Button } from "@/components/ui";
import AuthGuard from "@/components/AuthGuard";

const statusVariant: Record<string, "success" | "default" | "high" | "medium" | "info"> = {
  paid: "success",
  pending: "medium",
  shipped: "info",
  delivered: "success",
  cancelled: "high",
};

function OrdersContent() {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) return <p className="text-text-muted">Cargando órdenes...</p>;
  if (error) return <p className="text-red-500">Error: {(error as Error).message}</p>;

  return (
    <div className="space-y-4">
      {orders?.length === 0 ? (
        <Card className="text-center py-8">
          <Card.Body>
            <p className="text-text-muted mb-4">No tienes órdenes aún</p>
            <Button href="/products" variant="primary">Ver Productos</Button>
          </Card.Body>
        </Card>
      ) : (
        orders?.map((order) => (
          <Card key={order.id}>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text">Orden #{order.id}</p>
                  <p className="text-text-muted text-sm">
                    {new Date(order.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={statusVariant[order.status] || "default"}>{order.status}</Badge>
                  <p className="font-bold text-text mt-1">${order.total}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <div>
        <h1 className="text-2xl font-bold text-text mb-6">Mis Órdenes</h1>
        <OrdersContent />
      </div>
    </AuthGuard>
  );
}
