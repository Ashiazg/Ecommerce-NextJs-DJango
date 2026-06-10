import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Usuario debe tener al menos 3 caracteres").max(50),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const productSchema = z.object({
  name: z.string().min(3, "Nombre debe tener al menos 3 caracteres").max(200),
  description: z.string().min(10, "Descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  category: z.number().int().positive(),
  product_type: z.enum(["one_time", "subscription"]),
  stock: z.coerce.number().int().min(0).default(0),
});

export const checkoutSchema = z.object({
  email: z.string().email("Email inválido").optional(),
  address: z.string().min(5, "Dirección requerida").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
