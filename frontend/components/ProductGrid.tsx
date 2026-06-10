"use client";

import { useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "./ProductCard";

type SortOption = "default" | "price-asc" | "price-desc" | "name" | "newest";

type ProductGridProps = {
  limit?: number;
  category?: string;
  product_type?: string;
  search?: string;
  sort?: SortOption;
};

export default function ProductGrid({
  limit,
  category,
  product_type,
  search,
  sort = "default",
}: ProductGridProps) {
  const { data: products, isLoading, error } = useProducts({ category, product_type });

  const filtered = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    if (limit) result = result.slice(0, limit);
    return result;
  }, [products, search, sort, limit]);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-border" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 rounded bg-border" />
              <div className="h-5 w-3/4 rounded bg-border" />
              <div className="h-4 w-full rounded bg-border" />
              <div className="h-8 w-24 rounded bg-border" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center py-8">
        Error al cargar productos
      </p>
    );

  if (!filtered.length)
    return (
      <div className="text-center py-12 text-text-muted">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-medium">No se encontraron productos</p>
        <p className="text-sm mt-1">
          {search
            ? `Sin resultados para "${search}"`
            : "No hay productos disponibles en esta categoría"}
        </p>
      </div>
    );

  return (
    <>
      <p className="text-sm text-text-muted mb-4">
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
