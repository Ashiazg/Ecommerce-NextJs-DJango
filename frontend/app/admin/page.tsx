"use client";

import Link from "next/link";
import { useProducts, useCategories } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { Card } from "@/components/ui";

export default function AdminDashboardPage() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const { data: orders } = useOrders();

  const stats = [
    { label: "Productos", value: products?.length ?? 0, icon: "🛍️", href: "/admin/products" },
    { label: "Categorías", value: categories?.length ?? 0, icon: "🏷️", href: "/admin/categories" },
    { label: "Órdenes", value: orders?.length ?? 0, icon: "📦", href: "/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Card.Body>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <p className="text-2xl font-bold text-text">{s.value}</p>
                    <p className="text-sm text-text-muted">{s.label}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>Órdenes Recientes</Card.Header>
          <Card.Body>
            {orders?.slice(0, 5).map((o) => (
              <div key={o.id} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-text">#{o.id}</span>
                <span className="text-sm text-text-muted">${o.total}</span>
                <span className="text-xs capitalize">{o.status}</span>
              </div>
            )) ?? <p className="text-sm text-text-muted">Sin órdenes</p>}
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>Acceso Rápido</Card.Header>
          <Card.Body className="space-y-2">
            <Link href="/admin/products" className="block text-primary hover:underline text-sm">+ Crear Producto</Link>
            <Link href="/admin/categories" className="block text-primary hover:underline text-sm">+ Crear Categoría</Link>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
