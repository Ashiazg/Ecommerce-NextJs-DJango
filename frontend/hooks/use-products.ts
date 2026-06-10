"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts, getProduct, getCategories,
  createProduct, updateProduct, deleteProduct,
  createCategory, deleteCategory,
  type Product, type Category,
} from "@/lib/api";

export function useProducts(params?: { category?: string; product_type?: string }) {
  return useQuery<Product[]>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ["products", slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Parameters<typeof updateProduct>[1] }) =>
      updateProduct(slug, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
