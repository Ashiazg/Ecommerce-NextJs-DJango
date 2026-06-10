const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || err.message || "Request failed");
  }
  return res.json();
}

// --- Auth ---
export type LoginInput = { username: string; password: string };
export type RegisterInput = { username: string; email: string; password: string };
export type User = { id: number; username: string; email: string; role: "admin" | "customer"; stripe_customer_id?: string };

export async function login(input: LoginInput): Promise<{ access: string; refresh: string }> {
  return request("/token/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function register(input: RegisterInput): Promise<User> {
  return request("/register/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMe(): Promise<User> {
  return request("/users/me/");
}

// --- Products ---
export type Category = { id: number; name: string; slug: string; description: string };
export type ProductImage = { id: number; image: string; is_primary: boolean };
export type Product = {
  id: number; category: number; category_name: string; name: string;
  slug: string; description: string; price: string; product_type: "one_time" | "subscription";
  stripe_price_id?: string; stock: number; available: boolean;
  images: ProductImage[]; created_at: string;
};

export async function getProducts(params?: { category?: string; product_type?: string }): Promise<Product[]> {
  const clean = Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v != null && v !== "")
  );
  const qs = new URLSearchParams(clean).toString();
  return request(`/products/${qs ? `?${qs}` : ""}`);
}

export async function getProduct(slug: string): Promise<Product> {
  return request(`/products/${slug}/`);
}

export async function getCategories(): Promise<Category[]> {
  return request("/categories/");
}

// --- Admin: Categories ---
export async function createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
  return request("/categories/", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteCategory(id: number): Promise<void> {
  await request(`/categories/${id}/`, { method: "DELETE" });
}

// --- Admin: Products ---
export async function createProduct(data: {
  name: string; description: string; price: string; category: number;
  product_type: "one_time" | "subscription"; stock: number;
}): Promise<Product> {
  return request("/products/", { method: "POST", body: JSON.stringify(data) });
}

export async function updateProduct(slug: string, data: Partial<{
  name: string; description: string; price: string; category: number;
  product_type: string; stock: number; available: boolean;
}>): Promise<Product> {
  return request(`/products/${slug}/`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteProduct(slug: string): Promise<void> {
  await request(`/products/${slug}/`, { method: "DELETE" });
}

// --- Cart ---
export type CartData = { items: { id: number; product: Product; quantity: number }[]; total: string };

export async function getCart(): Promise<CartData> {
  return request("/cart/");
}

export async function addCartItem(productId: number, quantity = 1): Promise<CartData> {
  return request("/cart/add_item/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

// --- Orders ---
export type Order = {
  id: number; status: string; total: string;
  items: { product_name: string; quantity: number; price: string }[];
  created_at: string;
};

export async function getOrders(): Promise<Order[]> {
  return request("/orders/");
}

export async function getOrder(id: number): Promise<Order> {
  return request(`/orders/${id}/`);
}

// --- Stripe Checkout (via Next.js API proxy) ---
export async function createCheckoutSession(input: {
  items: { product_id: number; quantity: number }[];
  mode: "payment" | "subscription";
}): Promise<{ url: string }> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Checkout failed");
  return res.json();
}
