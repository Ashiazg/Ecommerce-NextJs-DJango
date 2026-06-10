"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/use-products";
import { useCartStore } from "@/lib/stores/cart-store";
import { Card, Badge, Button } from "@/components/ui";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading)
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-border rounded-xl" />
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-border" />
          <div className="h-10 w-3/4 rounded bg-border" />
          <div className="h-8 w-24 rounded bg-border" />
          <div className="h-20 w-full rounded bg-border" />
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-text-muted">Producto no encontrado</p>
        <Button href="/products" variant="primary" className="mt-4">
          Volver a Productos
        </Button>
      </div>
    );

  const images = product.images?.length
    ? product.images
    : [{ image: "", is_primary: true }];
  const currentImage = images[selectedImage]?.image || images[0]?.image;

  const handleAdd = () => {
    addItem({
      id: 0,
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: currentImage,
      product_type: product.product_type,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image gallery */}
      <div>
        <div className="aspect-square bg-surface-alt rounded-xl overflow-hidden mb-3">
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              Sin imagen
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                  i === selectedImage
                    ? "border-primary"
                    : "border-border hover:border-text-muted"
                }`}
              >
                <img
                  src={img.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div>
        <div className="flex gap-2 mb-3">
          <Badge
            variant={
              product.product_type === "subscription" ? "info" : "default"
            }
          >
            {product.product_type === "subscription" ? "Suscripción" : "Pago único"}
          </Badge>
          <Link href={`/products?category=${product.category_name.toLowerCase()}`}>
            <Badge variant="default" className="hover:bg-border cursor-pointer">
              {product.category_name}
            </Badge>
          </Link>
          {!product.available && <Badge variant="high">Agotado</Badge>}
        </div>

        <h1 className="text-3xl font-bold text-text mb-2">{product.name}</h1>
        <p className="text-3xl font-bold text-primary mb-4">
          ${Number(product.price).toFixed(2)}
        </p>

        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-sm text-accent mb-3">
            ⚡ Solo {product.stock} unidades disponibles
          </p>
        )}

        <p className="text-text-muted leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Quantity selector */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-medium text-text">Cantidad:</span>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-alt transition"
            >
              −
            </button>
            <span className="w-12 text-center text-sm font-medium text-text">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-alt transition"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            className={`w-full !py-3 text-base transition-all ${
              added ? "!bg-green-500" : ""
            }`}
            onClick={handleAdd}
            disabled={!product.available}
          >
            {added ? "✓ Agregado al Carrito" : "Agregar al Carrito"}
          </Button>
          <Button
            variant="secondary"
            href="/products"
            className="w-full !py-3 text-base"
          >
            ← Seguir Comprando
          </Button>
        </div>
      </div>
    </div>
  );
}
