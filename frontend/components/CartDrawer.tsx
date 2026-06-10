"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { Button, Card } from "@/components/ui";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotal, getCount } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={toggleCart} />
      <div className="fixed right-0 top-0 h-full w-96 max-w-full bg-surface shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-text text-lg">Carrito ({getCount()})</h2>
          <button onClick={toggleCart} className="text-text-muted hover:text-text text-xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-text-muted text-center py-8">Carrito vacío</p>
          ) : (
            items.map((item) => (
              <Card key={item.product_id} className="!p-3">
                <div className="flex items-start gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text text-sm truncate">{item.name}</p>
                    <p className="text-sm text-text-muted">${item.price} x {item.quantity}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-border text-sm"
                      >-</button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-border text-sm"
                      >+</button>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="ml-auto text-red-500 text-xs hover:text-red-600"
                      >Eliminar</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex justify-between font-semibold text-text">
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <Button variant="primary" href="/checkout" className="w-full" onClick={toggleCart}>
              Ir al checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
