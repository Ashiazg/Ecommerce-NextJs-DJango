"use client";

import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { useCartStore } from "@/lib/stores/cart-store";
import { useState } from "react";
import type { Product } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const primaryImage = product.images?.find((i) => i.is_primary) || product.images?.[0];

  const handleAdd = () => {
    addItem({
      id: 0,
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: primaryImage?.image,
      product_type: product.product_type,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-surface-alt flex items-center justify-center overflow-hidden relative">
          {primaryImage ? (
            <img
              src={primaryImage.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-text-muted text-sm">Sin imagen</span>
          )}
          {!product.available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="high">Agotado</Badge>
            </div>
          )}
        </div>
      </Link>
      <Card.Body>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={product.product_type === "subscription" ? "info" : "default"}>
            {product.product_type === "subscription" ? "Suscripción" : "Único"}
          </Badge>
          <span className="text-xs text-text-muted">{product.category_name}</span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="font-semibold text-text block hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-text-muted text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-text">${Number(product.price).toFixed(2)}</span>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-accent">Solo {product.stock} uds.</p>
            )}
          </div>
          <Button
            variant="primary"
            className={`text-xs px-3 py-1 transition-all ${added ? "!bg-green-500 scale-105" : ""}`}
            onClick={handleAdd}
            disabled={!product.available}
          >
            {added ? "✓ Agregado" : "+ Carrito"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
