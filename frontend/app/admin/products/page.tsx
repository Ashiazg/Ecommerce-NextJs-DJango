"use client";

import { useState } from "react";
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { Card, Input, Select, Button, Badge, Modal } from "@/components/ui";
import { productSchema } from "@/lib/schemas";
import type { Product } from "@/lib/api";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.currentTarget);
    const raw = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      price: form.get("price") as string,
      category: Number(form.get("category")),
      product_type: form.get("product_type") as "one_time" | "subscription",
      stock: Number(form.get("stock")),
    };
    const result = productSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]?.toString() ?? "form"] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    createProduct.mutate({ ...result.data, price: String(result.data.price) }, {
      onSuccess: () => { setShowCreate(false); (e.target as HTMLFormElement).reset(); },
      onError: (err) => setErrors({ form: err.message }),
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProduct) return;
    setErrors({});
    const form = new FormData(e.currentTarget);
    const raw = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      price: form.get("price") as string,
      category: Number(form.get("category")),
      product_type: form.get("product_type") as "one_time" | "subscription",
      stock: Number(form.get("stock")),
    };
    const result = productSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]?.toString() ?? "form"] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    updateProduct.mutate(
      { slug: editProduct.slug, data: { ...result.data, price: String(result.data.price) } },
      { onSuccess: () => setEditProduct(null), onError: (err) => setErrors({ form: err.message }) }
    );
  };

  const catOptions = categories?.map((c) => ({ value: String(c.id), label: c.name })) || [];
  const typeOptions = [
    { value: "one_time", label: "Pago único" },
    { value: "subscription", label: "Suscripción" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Productos</h1>
        <Button variant="primary" onClick={() => setShowCreate(true)}>+ Nuevo</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <p className="text-text-muted">Cargando...</p>
        ) : products?.length === 0 ? (
          <p className="text-text-muted">No hay productos.</p>
        ) : (
          products?.map((p) => (
            <Card key={p.id}>
              <div className="flex gap-4 !p-4">
                {p.images?.[0] && (
                  <img src={p.images[0].image} alt={p.name} className="w-20 h-20 object-cover rounded-lg" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-text truncate">{p.name}</p>
                    <Badge variant={p.available ? "success" : "high"}>
                      {p.available ? "Disponible" : "Agotado"}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted">{p.category_name}</p>
                  <p className="text-sm font-semibold text-text mt-1">${p.price}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="secondary" className="text-xs !py-1 !px-2" onClick={() => setEditProduct(p)}>Editar</Button>
                  <Button
                    variant="danger" className="text-xs !py-1 !px-2"
                    onClick={() => { if (confirm("¿Eliminar producto?")) deleteProduct.mutate(p.slug); }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nuevo Producto">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input name="name" label="Nombre" error={errors.name} />
          <Input name="description" label="Descripción" error={errors.description} />
          <div className="grid grid-cols-2 gap-3">
            <Input name="price" label="Precio" type="number" step="0.01" error={errors.price} />
            <Input name="stock" label="Stock" type="number" defaultValue="0" />
          </div>
          <Select name="category" label="Categoría" options={catOptions} error={errors.category} />
          <Select name="product_type" label="Tipo" options={typeOptions} />
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{createProduct.isPending ? "Creando..." : "Crear"}</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Editar Producto">
        {editProduct && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input name="name" label="Nombre" defaultValue={editProduct.name} error={errors.name} />
            <Input name="description" label="Descripción" defaultValue={editProduct.description} error={errors.description} />
            <div className="grid grid-cols-2 gap-3">
              <Input name="price" label="Precio" type="number" step="0.01" defaultValue={editProduct.price} error={errors.price} />
              <Input name="stock" label="Stock" type="number" defaultValue={String(editProduct.stock)} />
            </div>
            <Select name="category" label="Categoría" options={catOptions}
              defaultValue={String(editProduct.category)} error={errors.category} />
            <Select name="product_type" label="Tipo" options={typeOptions} defaultValue={editProduct.product_type} />
            {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setEditProduct(null)}>Cancelar</Button>
              <Button type="submit" variant="primary">{updateProduct.isPending ? "Guardando..." : "Guardar"}</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
