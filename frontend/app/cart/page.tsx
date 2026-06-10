"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { Card, Button } from "@/components/ui";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Carrito de Compras</h1>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <Card.Body>
            <p className="text-text-muted mb-4">Tu carrito está vacío</p>
            <Button href="/products" variant="primary">Ver Productos</Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.product_id}>
              <Card.Body>
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <Link href={`/products/${item.product_id}`} className="font-semibold text-text hover:text-primary">
                      {item.name}
                    </Link>
                    <p className="text-text-muted text-sm">${item.price} c/u</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="w-8 h-8 rounded border border-border text-sm">-</button>
                      <span className="font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-border text-sm">+</button>
                      <button onClick={() => removeItem(item.product_id)}
                        className="ml-auto text-red-500 text-sm hover:text-red-600">Eliminar</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-text">Total</span>
                <span className="text-2xl font-bold text-primary">${getTotal().toFixed(2)}</span>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost" href="/products">Seguir comprando</Button>
              <Button variant="primary" href="/checkout" className="flex-1">Pagar ahora</Button>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
}
