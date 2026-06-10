"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/use-products";
import ProductGrid from "@/components/ProductGrid";

const typeOptions = [
  { value: "", label: "Todos" },
  { value: "one_time", label: "Pago único" },
  { value: "subscription", label: "Suscripción" },
] as const;

const sortOptions = [
  { value: "default", label: "Por defecto" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name", label: "A - Z" },
  { value: "newest", label: "Novedades" },
] as const;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { data: categories } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [productType, setProductType] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const activeFilters = [selectedCategory, productType].filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Productos</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            !selectedCategory
              ? "bg-primary text-white"
              : "bg-surface-alt text-text-muted hover:text-text hover:bg-border"
          }`}
        >
          Todos
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat.slug
                ? "bg-primary text-white"
                : "bg-surface-alt text-text-muted hover:text-text hover:bg-border"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Type + Sort bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-border">
        {typeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setProductType(opt.value)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              productType === opt.value
                ? "bg-secondary/10 text-secondary border border-secondary/30"
                : "bg-transparent text-text-muted border border-border hover:border-text-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {activeFilters > 0 && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setProductType("");
                setSearch("");
                setSort("default");
              }}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Limpiar filtros ({activeFilters})
            </button>
          )}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductGrid
        category={selectedCategory}
        product_type={productType}
        search={search}
        sort={sort as any}
      />
    </div>
  );
}
