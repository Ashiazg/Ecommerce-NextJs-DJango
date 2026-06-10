"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-products";
import { Card, Input, Button, Modal } from "@/components/ui";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const createCat = useCreateCategory();
  const deleteCat = useDeleteCategory();
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const slug = form.get("slug") as string;
    const description = form.get("description") as string;

    if (!name.trim()) { setErrors({ name: "Nombre requerido" }); return; }
    if (!slug.trim()) { setErrors({ slug: "Slug requerido" }); return; }

    createCat.mutate(
      { name, slug, description },
      {
        onSuccess: () => { setShowModal(false); (e.target as HTMLFormElement).reset(); },
        onError: (err) => setErrors({ form: err.message }),
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Categorías</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>+ Nueva</Button>
      </div>

      <Card>
        <Card.Body>
          {isLoading ? (
            <p className="text-text-muted">Cargando...</p>
          ) : categories?.length === 0 ? (
            <p className="text-text-muted">No hay categorías. Crea una.</p>
          ) : (
            <div className="divide-y divide-border">
              {categories?.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-text">{cat.name}</p>
                    <p className="text-xs text-text-muted">/{cat.slug}</p>
                  </div>
                  <Button
                    variant="danger"
                    className="text-xs !py-1 !px-2"
                    onClick={() => { if (confirm("¿Eliminar categoría?")) deleteCat.mutate(cat.id); }}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Categoría">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input name="name" label="Nombre" placeholder="Electrónica" error={errors.name} />
          <Input name="slug" label="Slug" placeholder="electronica" error={errors.slug} />
          <Input name="description" label="Descripción" placeholder="Productos electrónicos" />
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{createCat.isPending ? "Creando..." : "Crear"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
