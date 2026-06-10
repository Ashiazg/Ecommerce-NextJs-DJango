# Guía Completa: Ecommerce Full-Stack

Aprende a construir este proyecto entendiendo **qué hace cada línea de código**, **cómo se conectan las piezas** y **por qué se usa cada herramienta**.

---

## 📘 Cómo leer esta guía

Cada sección sigue este orden:

1. **Concepto** — explicación directa de qué hace y por qué se usa
2. **Código línea por línea** — cada línea se explica individualmente
3. **Antes vs Después** — comparativa visual de React puro vs con la herramienta
4. **Ejercicio** — mini-reto de 2 minutos para afianzar

Abre DOS terminales y el código en VS Code. No leas pasivamente — **escribe cada línea tú mismo**.

---

## Índice

### Bloque 1 — El Frontend (Next.js + Tailwind)
- [1.1 React: la base de todo](#11-react-la-base-de-todo)
- [1.2 App Router: el mapa de la app](#12-app-router-el-mapa-de-la-app)
- [1.3 "use client" vs Server Component](#13-use-client-vs-server-component)
- [1.4 Tailwind: CSS sin archivos CSS](#14-tailwind-css-sin-archivos-css)
- [1.5 Modo oscuro: cómo cambia todo de color](#15-modo-oscuro-cómo-cambia-todo-de-color)

### Bloque 2 — Los Datos (del backend a la pantalla)
- [2.1 fetch: cómo pedir datos](#21-fetch-cómo-pedir-datos)
- [2.2 El problema del fetch a pie](#22-el-problema-del-fetch-a-pie)
- [2.3 TanStack Query: caché de datos del servidor](#23-tanstack-query-caché-de-datos-del-servidor)
- [2.4 Mutaciones: crear y modificar datos](#24-mutaciones-crear-y-modificar-datos)

### Bloque 3 — Estado Local (Zustand + Zod)
- [3.1 Zustand vs TanStack Query](#31-zustand-vs-tanstack-query)
- [3.2 Zustand: create, set, get](#32-zustand-create-set-get)
- [3.3 Zod: validación de formularios](#33-zod-validación-de-formularios)

### Bloque 4 — Backend (Django + JWT + Stripe)
- [4.1 Modelo: cómo se guardan los datos](#41-modelo-cómo-se-guardan-los-datos)
- [4.2 Serializer: traductor Python ↔ JSON](#42-serializer-traductor-python--json)
- [4.3 ViewSet: las 5 operaciones en una clase](#43-viewset-las-5-operaciones-en-una-clase)
- [4.4 Router: qué URL hace qué](#44-router-qué-url-hace-qué)
- [4.5 JWT: autenticación por tokens](#45-jwt-autenticación-por-tokens)
- [4.6 Guards: quién puede entrar](#46-guards-quién-puede-entrar)
- [4.7 Stripe: cómo se pagan los productos](#47-stripe-cómo-se-pagan-los-productos)

### Bloque 5 — Cómo se conecta TODO
- [5.1 Mapa mental del proyecto](#51-mapa-mental-del-proyecto)
- [5.2 Camino de un clic](#52-camino-de-un-clic)
- [5.3 Guía de arranque rápido](#53-guía-de-arranque-rápido)

---

# BLOQUE 1 — El Frontend (Next.js + Tailwind)

---

## 1.1 React: la base de todo

### Para los que empiezan

React construye páginas web con **componentes**: funciones de JavaScript que devuelven HTML.

Un componente es una función de JavaScript que devuelve HTML:

```tsx
// components/Saludo.tsx
export default function Saludo() {
  return <h1>Hola Mundo</h1>;
}
```

Luego usas ese componente dentro de otro:

```tsx
// app/page.tsx
import Saludo from "@/components/Saludo";

export default function Home() {
  return (
    <div>
      <Saludo />    {/* ← Aquí aparece "Hola Mundo" */}
      <p>Bienvenido</p>
    </div>
  );
}
```

**Esto es Server Component** (no tiene `"use client"`). Next.js lo procesa en el servidor y envía el HTML ya listo al navegador.

### Estados: useState

Cuando necesitas que algo **cambie** en la página (como un contador), usas `useState`:

```tsx
"use client";

import { useState } from "react";

export default function Contador() {
  // useState(valorInicial) → devuelve [valorActual, funciónParaCambiarlo]
  const [cuenta, setCuenta] = useState(0);

  return (
    <div>
      <p>Has hecho clic {cuenta} veces</p>
      <button onClick={() => setCuenta(cuenta + 1)}>+1</button>
    </div>
  );
}
```

**Línea por línea:**

| Línea | Qué hace |
|:------|:---------|
| `"use client"` | Marca esto como Client Component (necesario para usar useState) |
| `import { useState } from "react"` | Trae la función useState de React |
| `const [cuenta, setCuenta] = useState(0)` | Crea una variable `cuenta` que empieza en 0. `setCuenta` es la única forma de cambiarla |
| `{cuenta}` | Muestra el valor actual |
| `onClick={() => setCuenta(cuenta + 1)}` | Cuando hacen clic, aumenta la cuenta en 1 |

**Cuando cambia `cuenta`**, React vuelve a ejecutar el componente y la página se actualiza sola.

### Efectos secundarios: useEffect

`useEffect` ejecuta código **después** de que el componente aparece en pantalla:

```tsx
useEffect(() => {
  // Esto se ejecuta UNA SOLA VEZ cuando el componente se monta
  console.log("El componente apareció en pantalla");
}, []); // ← El array vacío significa "solo una vez al inicio"
```

Lo usamos para pedir datos a la API cuando la página se carga.

### ¿Qué son los Hooks?

`useState`, `useEffect` y los demás que veremos (`useQuery`, `useMutation`, `useContext`) son **Hooks**: funciones de React que empiezan con `use` y te permiten "engancharte" a características de React (estado, ciclo de vida, caché, etc.) desde un componente funcional.

**Antes de los Hooks (2018):**
Para tener estado en un componente había que usar clases de JavaScript:

```jsx
// Cómo se hacía antes (class component)
class Contador extends React.Component {
  constructor() {
    super();
    this.state = { cuenta: 0 };
  }
  componentDidMount() {
    console.log("El componente se montó");
  }
  render() {
    return <p>{this.state.cuenta}</p>;
  }
}
```

**Con Hooks:**

```tsx
function Contador() {
  const [cuenta, setCuenta] = useState(0);
  useEffect(() => { console.log("Se montó"); }, []);
  return <p>{cuenta}</p>;
}
```

Menos código, más fácil de leer, y no necesitas `this`.

**Reglas de los Hooks:**

1. Solo se llaman en el nivel superior del componente (no dentro de `if`, `for` o funciones anidadas)
2. Solo se usan en componentes de React o en tus propios hooks personalizados

### useEffect a fondo

`useEffect` se ejecuta **después de renderizar** el componente. Cuándo se vuelve a ejecutar depende del **array de dependencias**:

| Array | Comportamiento | Caso de uso |
|:------|:---------------|:------------|
| Sin array | Se ejecuta en **cada render** (cuidado: bucle infinito si modificas estado) | Rara vez se usa |
| `[]` (vacío) | Solo cuando el componente **se monta** | Fetch inicial, suscripciones |
| `[variable]` | Cuando `variable` **cambie** | Sincronizar con localStorage, actualizar título |

```tsx
useEffect(() => {
  document.title = `Has hecho ${cuenta} clics`;
}, [cuenta]); // ← Se ejecuta cada vez que cuenta cambia
```

**Cleanup (limpieza):** si retornas una función dentro de `useEffect`, React la ejecuta cuando el componente se desmonta o antes de volver a ejecutar el efecto:

```tsx
useEffect(() => {
  const timer = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(timer); // ← Limpia cuando el componente desaparece
}, []);
```

**Ejercicio:** Crea un componente que muestre "Han pasado X segundos". Usa `useState` para el contador y `useEffect` con `setInterval` para aumentarlo cada segundo. Acuérdate del cleanup.

---

## 1.2 App Router: el mapa de la app

### Para los que empiezan

En Next.js, **las carpetas SON las URLs**. No necesitas configurar rutas en ningún lado — solo creas carpetas.

```
Carpeta                          →  URL
────────────────────────────────────────────────────
app/page.tsx                     →  /
app/products/page.tsx            →  /products
app/products/[slug]/page.tsx     →  /products/cualquier-cosa
app/cart/page.tsx                →  /cart
app/admin/products/page.tsx      →  /admin/products
app/api/checkout/route.ts        →  POST /api/checkout (API, no página)
```

### Rutas estáticas

```tsx
// app/about/page.tsx → http://localhost:3000/about
export default function About() {
  return <h1>Sobre nosotros</h1>;
}
```

### Rutas dinámicas [slug]

Los corchetes `[slug]` significan "cualquier valor":

```tsx
// app/products/[slug]/page.tsx
// http://localhost:3000/products/iphone-15
// http://localhost:3000/products/zapatillas

export default function ProductPage({ params }: { params: { slug: string } }) {
  // params.slug = "iphone-15" o "zapatillas" o lo que sea
  return <h1>Producto: {params.slug}</h1>;
}
```

### layout.tsx: el marco de todas las páginas

`app/layout.tsx` envuelve TODAS las páginas. Lo que pongas aquí se ve en todas las rutas:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav>Este menú se ve en TODAS las páginas</nav>
        <main>{children}</main>  {/* ← Aquí cambia el contenido según la ruta */}
        <footer>Este pie se ve en TODAS las páginas</footer>
      </body>
    </html>
  );
}
```

**El layout NO se re-renderiza al cambiar de página.** Solo cambia `{children}`. Por eso el Navbar va aquí — nunca parpadea.

### Barra de navegación (Navbar)

El Navbar está en `components/ui/Navbar.tsx` y se usa en `layout.tsx`. Tiene:

- **Desktop**: links visibles (`hidden sm:flex`)
- **Móvil**: botón hamburguesa que despliega menú (`sm:hidden`)
- **Carrito**: badge con número de items
- **Tema**: botón 🌙/☀️
- **Usuario**: UserMenu (login/logout)

```tsx
// Componentes clave del Navbar
<nav>
  <Link href="/">Logo</Link>

  {/* Desktop: visible desde 640px */}
  <div className="hidden sm:flex">Links...</div>

  {/* Móvil: botón hamburguesa */}
  <button className="sm:hidden" onClick={toggleMenu}>
    {menuOpen ? <X/> : <Hamburger/>}
  </button>

  {/* Carrito */}
  <button onClick={toggleCart}>
    🛒 <span>{cartCount}</span>
  </button>
</nav>
```

### Ejercicio

Crea una ruta `/promociones` que muestre "Promociones". Solo necesitas crear una carpeta y un archivo.

<details>
<summary>Solución</summary>

Crea `app/promociones/page.tsx`:

```tsx
export default function Promociones() {
  return <h1>🔥 Promociones especiales</h1>;
}
```

Abre `http://localhost:3000/promociones`.
</details>

---

## 1.3 "use client" vs Server Component

### Para los que empiezan

Next.js tiene DOS tipos de componentes:

| Tipo | `"use client"` | ¿Puede usar useState? | ¿Puede usar onClick? | ¿Puede usar TanStack Query? |
|:-----|:---------------|:----------------------|:---------------------|:----------------------------|
| **Server Component** | ❌ No | ❌ No | ❌ No | ❌ No |
| **Client Component** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí |

**Regla de oro:**

Si tu archivo necesita interactividad (clics, escritura, carga de datos), ponle `"use client"` en la primera línea:

```tsx
"use client";  // ← PRIMERA LÍNEA del archivo

import { useState } from "react";

export default function Formulario() {
  const [texto, setTexto] = useState("");
  return <input value={texto} onChange={e => setTexto(e.target.value)} />;
}
```

**Server Components son más rápidos** porque Next.js los convierte a HTML en el servidor y envía el resultado. Los Client Components necesitan JavaScript en el navegador.

**Los dos pueden convivir** — un Server Component puede contener un Client Component:

```tsx
// app/page.tsx — Server Component (sin "use client")
import ProductGrid from "@/components/ProductGrid"; // ← Client Component

export default function Home() {
  return (
    <div>
      <h1>Bienvenido</h1>
      <ProductGrid /> {/* ← Este tiene "use client" y funciona igual */}
    </div>
  );
}
```

### Ejercicio

Identifica qué archivos en `app/` necesitan `"use client"` y cuáles no. Pista: busca `useState`, `useEffect`, hooks de TanStack Query, o `onClick`.

---

## 1.4 Tailwind: CSS sin archivos CSS

### Para los que empiezan

Normalmente escribes CSS así:

```css
.boton-rojo {
  background-color: red;
  color: white;
  padding: 10px 20px;
}
```

Luego en HTML: `<button class="boton-rojo">Eliminar</button>`.

Con Tailwind, **escribes los estilos directamente en el className**:

```tsx
<button className="bg-red-500 text-white px-4 py-2 rounded-lg">
  Eliminar
</button>
```

Cada clase significa una propiedad CSS:

| Clase Tailwind | CSS equivalente |
|:---------------|:----------------|
| `bg-red-500` | `background-color: #ef4444` |
| `text-white` | `color: white` |
| `px-4` | `padding-left: 16px; padding-right: 16px` |
| `py-2` | `padding-top: 8px; padding-bottom: 8px` |
| `rounded-lg` | `border-radius: 8px` |

### Colores personalizados

En `globals.css` definimos colores con nombres:

```css
@theme inline {
  --color-primary: #7c3aed;     /* Morado */
  --color-surface: #ffffff;      /* Blanco */
  --color-text: #0f172a;         /* Casi negro */
}
```

Y los usamos así:

```tsx
<button className="bg-primary text-white">  {/* ← bg-primary usa el color morado */}
<button className="text-text">              {/* ← text-text usa el casi negro */}
<div className="bg-surface">                {/* ← bg-surface usa blanco */}
```

### Responsive (Mobile First)

Tailwind funciona "mobile first": el estilo base es para móvil, y usas prefijos para pantallas más grandes:

```tsx
<div className="
  grid-cols-1         /* 1 columna en móvil */
  sm:grid-cols-2      /* 2 columnas desde 640px */
  lg:grid-cols-3      /* 3 columnas desde 1024px */
  gap-6               /* espacio entre celdas */
">
```

### Modo oscuro

```tsx
<div className="
  bg-white            /* fondo blanco en modo claro */
  dark:bg-gray-900    /* fondo gris oscuro en modo oscuro */
">
```

La clase `.dark` se aplica al `<html>` y Tailwind la reconoce automáticamente.

### Ejercicio

Dale estilo a un botón: fondo azul, texto blanco, padding de 12px vertical y 24px horizontal, bordes redondeados.

<details>
<summary>Solución</summary>

```tsx
<button className="bg-blue-500 text-white py-3 px-6 rounded-lg">
  Click
</button>
```
</details>

---

## 1.5 Modo oscuro: cómo cambia todo de color

### Para los que empiezan

El modo oscuro funciona con **variables CSS**:

1. En `globals.css` definimos colores normales
2. Dentro de `.dark { ... }` redefinimos los mismos colores pero más oscuros
3. Los componentes usan las variables (no colores fijos)
4. Al cambiar la clase del `<html>`, todos los componentes cambian automáticamente

```css
/* Colores en modo claro (por defecto) */
:root {
  --color-surface: #ffffff;
  --color-text: #0f172a;
}

/* Colores en modo oscuro */
.dark {
  --color-surface: #0b1120;   /* Azul muy oscuro */
  --color-text: #f1f5f9;      /* Blanco humo */
}
```

### El store del tema

El estado del tema se guarda en `lib/stores/theme-store.ts` usando Zustand con `persist`:

```tsx
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      toggle: () =>
        set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          document.documentElement.className = next; // Cambia clase del <html>
          return { theme: next };
        }),
    }),
    { name: "theme-storage" }  // ← Se guarda en localStorage
  )
);
```

**Paso a paso:**

1. Usuario hace clic en 🌙
2. `toggle()` cambia el tema de "light" a "dark"
3. `document.documentElement.className = "dark"` — cambia la clase del `<html>`
4. Todas las variables CSS se actualizan
5. Todos los componentes se re-renderizan con los nuevos colores
6. `persist` guarda "dark" en localStorage
7. Al recargar la página, el tema oscuro se restaura solo

### Ejercicio

Agrega un botón de cambio de tema en el móvil (ya existe en desktop). Pista: mira el Navbar, busca `toggleTheme`.

---

# BLOQUE 2 — Los Datos (del backend a la pantalla)

---

## 2.1 fetch: cómo pedir datos

### Para los que empiezan

Tu frontend (Next.js en `localhost:3000`) necesita datos del backend (Django en `localhost:8000`). La comunicación se hace con **fetch** — una función de JavaScript que envía una petición HTTP al servidor y recibe una respuesta.

```
Next.js ─── fetch("http://localhost:8000/api/products/") ───→ Django
                                                              │
                                                              ▼
Next.js ←─────────────── JSON de productos ───────────────── Django
```

**fetch** funciona así:

```ts
const respuesta = await fetch("http://localhost:8000/api/products/");
const productos = await respuesta.json();
```

### async/await explicado

`await` significa "**espera a que termine**". Sin `await`, el código seguiría ejecutándose antes de que llegue la respuesta:

```ts
// SIN await: productos es undefined porque la respuesta aún no llegó
let productos;
fetch("/api/products/").then(r => r.json()).then(d => productos = d);
console.log(productos); // ← undefined ❌

// CON await: espera a que llegue la respuesta
const respuesta = await fetch("/api/products/");
const productos = await respuesta.json();
console.log(productos); // ← Array de productos ✅
```

### useEffect + fetch (el método básico)

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ProductList() {
  // 1. Estado para guardar los productos
  const [products, setProducts] = useState([]);
  // 2. Estado para saber si está cargando
  const [loading, setLoading] = useState(true);
  // 3. Estado para errores
  const [error, setError] = useState(null);

  // 4. Ejecutar UNA VEZ cuando el componente aparece
  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar");
        return res.json();
      })
      .then((data) => {
        setProducts(data);   // Guarda los productos
        setLoading(false);   // Ya no está cargando
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // ← Array vacío = solo una vez

  // 5. Mostrar según el estado
  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (products.length === 0) return <p>No hay productos</p>;

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
```

**Línea por línea:**

| Línea | Qué hace |
|:------|:---------|
| `useState([])` | Crea variable `products` que empieza como array vacío |
| `useState(true)` | Crea variable `loading` que empieza en `true` |
| `useEffect(..., [])` | Ejecuta el código **una vez** cuando el componente se monta |
| `fetch(...)` | Hace la petición HTTP a Django |
| `.then(res => res.json())` | Convierte la respuesta en JSON |
| `.then(data => setProducts(data))` | Guarda los datos en el estado |
| `setLoading(false)` | Marca que ya terminó de cargar |
| `if (loading) return <p>Cargando...</p>` | Mientras carga, muestra esto |
| `{products.map(p => ...)}` | Itera sobre cada producto y renderiza HTML |

### El archivo api.ts

En `lib/api.ts` tenemos una función `request` que hace todo el trabajo repetitivo:

```ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // 1. Obtener token JWT (si existe)
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // 2. Armar headers
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;  // ← Login automático
  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // 3. Hacer fetch
  const res = await fetch(`${API}${path}`, { ...options, headers });

  // 4. Manejar errores
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || err.message || "Request failed");
  }

  // 5. Devolver datos tipados
  return res.json();
}
```

**¿Por qué existe esta función?** Para no repetir el token, los headers, y el manejo de errores en cada petición. Cada función de API la usa:

```ts
export async function getProducts(): Promise<Product[]> {
  return request("/products/");  // ← GET, con token si existe
}

export async function createProduct(data: any): Promise<Product> {
  return request("/products/", {  // ← POST, con token
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

### Ejercicio

Sin mirar la solución, escribe una función `getCategories()` que pida `/categories/` y devuelva las categorías.

<details>
<summary>Solución</summary>

```ts
export async function getCategories(): Promise<Category[]> {
  return request("/categories/");
}
```
</details>

---

## 2.2 El problema del fetch a pie

### Para los que empiezan

El método `useEffect + fetch` funciona, pero tiene un problema GRAVE:

**Cada vez que entras a la página, los productos se cargan de nuevo.**

Prueba esto:
1. Navega a `/products` → ves "Cargando..." → luego ves los productos
2. Navega a `/cart`
3. Vuelve a `/products` → **vuelves a ver "Cargando..."** aunque ya tenías los productos

Esto pasa porque:
- `useEffect` se ejecuta cuando el componente se monta
- Al navegar a otra ruta, el componente se desmonta (los datos se pierden)
- Al volver, el componente se monta otra vez y `useEffect` se ejecuta de nuevo

**Cada navegación = fetch nuevo = pantalla de carga.**

Además:
- **Sin caché**: si dos componentes necesitan los mismos productos, ambos hacen fetch
- **Sin refetch automático**: si alguien agrega un producto, no se refleja hasta que recargues
- **Sin manejo de errozs centralizado**: cada componente maneja errores a su manera

**TanStack Query resuelve TODO esto.** Y lo hace con menos código.

---

## 2.3 TanStack Query: caché de datos del servidor

### Concepto

TanStack Query guarda en **memoria (caché)** los datos que ya pediste al servidor. Cuando un componente pide los mismos datos otra vez, los sirve desde la caché sin hacer un nuevo fetch.

**Sin TanStack Query:**
- Montas componente → useEffect → fetch a Django → renderizas
- Desmontas componente → los datos se pierden
- Vuelves a montar → useEffect → fetch a Django OTRA VEZ

**Con TanStack Query:**
- Montas componente → useQuery → si no hay caché, hace fetch a Django
- Desmontas componente → la caché NO se pierde (sigue en memoria)
- Vuelves a montar → useQuery → usa la caché (sin fetch)
- Si pasó el `staleTime`, hace refetch en segundo plano y actualiza la UI

### queryKey

`queryKey` es el identificador único de cada conjunto de datos en la caché:

```tsx
useQuery({
  queryKey: ["products"],                    // ← Datos de productos
  queryFn: getProducts,
});

useQuery({
  queryKey: ["products", { category: "electronica" }],  // ← Datos diferentes (filtrados)
  queryFn: () => getProducts({ category: "electronica" }),
});
```

**Cada `queryKey` diferente = un conjunto de datos diferente en la caché.** Si dos componentes usan `["products"]`, comparten la misma caché y no duplican peticiones.

### useQuery: el reemplazo de useEffect + fetch

**Antes (React puro):**

```tsx
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch("/api/products/")
    .then(res => res.json())
    .then(data => { setProducts(data); setLoading(false); })
    .catch(err => { setError(err.message); setLoading(false); });
}, []);
```

**Después (TanStack Query):**

```tsx
const { data: products, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});
```

**Código más corto, más legible, y con caché automática.**

### Las 3 cosas que devuelve useQuery

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});

// isLoading = true mientras esperamos (nunca vimos los datos antes)
// data = los productos (undefined mientras isLoading es true)
// error = si algo falló
```

| Estado | isLoading | data | error |
|:-------|:----------|:-----|:------|
| Cargando por primera vez | ✅ true | undefined | null |
| Datos en caché (no necesita recargar) | ❌ false | ✅ datos | null |
| Recargando en background | ❌ false | ✅ datos (viejos) | null |
| Error | ❌ false | undefined o últimos datos | ✅ mensaje |

### staleTime: cuándo se considera obsoleto

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,  // 1 minuto
    },
  },
});
```

- Si los datos tienen **menos de 1 minuto**: usa la caché (sin fetch)
- Si tienen **más de 1 minuto**: considera los datos "viejos" y hace refetch en background
- El refetch en background **no muestra "Cargando..."** — muestra los datos viejos hasta que lleguen los nuevos

### Ejemplo completo

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, type Product } from "@/lib/api";

export default function ProductGrid() {
  // TanStack Query maneja la caché, el refetch, y los estados
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Los mismos 3 estados de siempre, pero sin useState ni useEffect
  if (isLoading) return <p className="text-text-muted">Cargando productos...</p>;
  if (error) return <p className="text-red-500">Error: {(error as Error).message}</p>;
  if (!products?.length) return <p className="text-text-muted">No hay productos</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Prueba la diferencia

1. Con useEffect: navega entre páginas — ves "Cargando..." cada vez
2. Con useQuery: navega entre páginas — **sin pantalla de carga** después de la primera vez

### Provider: configuración global

Para que TanStack Query funcione, debes envolver tu app en `QueryClientProvider` en el layout:

```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,   // 1 minuto
        retry: 1,                // 1 reintento si falla
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

Luego en `layout.tsx`:

```tsx
<Providers>
  <Navbar />
  <main>{children}</main>
</Providers>
```

### Ejercicio

Convierte este código a TanStack Query:

```tsx
const [categories, setCategories] = useState([]);
useEffect(() => {
  fetch("/api/categories/").then(r => r.json()).then(setCategories);
}, []);
```

<details>
<summary>Solución</summary>

```tsx
const { data: categories } = useQuery({
  queryKey: ["categories"],
  queryFn: getCategories,
});
```
</details>

---

## 2.4 Mutaciones: crear y modificar datos

### Para los que empiezan

`useQuery` es para **leer** datos (GET). `useMutation` es para **escribir** datos (POST, PUT, DELETE).

```
useQuery → GET → leer productos, órdenes, categorías
useMutation → POST → crear producto
            → PUT → actualizar producto
            → DELETE → eliminar producto
```

### useMutation

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      // Cuando el POST es exitoso, marcamos la caché como obsoleta
      qc.invalidateQueries({ queryKey: ["products"] });
      // TanStack Query hará refetch automático y la UI se actualizará sola
    },
  });
}
```

**Flujo completo:**

```
1. Usuario llena formulario y hace clic en "Crear"
2. createProduct.mutate(data) → TanStack Query hace POST a Django
3. Django guarda en la BD
4. onSuccess → invalidateQueries(["products"])
5. TanStack Query detecta "products" está viejo
6. Los componentes que usan useProducts() → hacen refetch
7. La lista de productos se actualiza sola 🎉
```

### Uso en un componente

```tsx
const createProduct = useCreateProduct();

const handleSubmit = (e) => {
  e.preventDefault();
  createProduct.mutate(
    { name: "Nuevo", price: "29.99", ... },
    {
      onSuccess: () => setShowForm(false),  // ← Cierra el formulario
      onError: (err) => setError(err.message),  // ← Muestra el error
    }
  );
};

return (
  <form onSubmit={handleSubmit}>
    <input name="name" />
    <input name="price" />
    <button type="submit">
      {createProduct.isPending ? "Creando..." : "Crear"}
      {/* isPending = true mientras esperamos respuesta */}
    </button>
  </form>
);
```

### Antes vs Después

**Antes (sin TanStack Query):**

```tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  try {
    await fetch("/api/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // Toca recargar la página manualmente para ver el nuevo producto
    window.location.reload();  // ← Feo
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Después (con TanStack Query):**

```tsx
const createProduct = useCreateProduct();

const handleSubmit = (data) => {
  createProduct.mutate(data, {
    onError: (err) => setError(err.message),
  });
  // No necesito recargar — invalidateQueries lo hace por mí
};
```

### Ejercicio

Escribe una mutación para eliminar un producto (DELETE).

<details>
<summary>Solución</summary>

```ts
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,           // ← DELETE /api/products/{slug}/
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
```
</details>

---

# BLOQUE 3 — Estado Local (Zustand + Zod)

---

## 3.1 Zustand vs TanStack Query

### Concepto

TanStack Query y Zustand manejan tipos de datos diferentes:

| Herramienta | ¿Qué datos? | ¿Dónde se almacenan? | Ejemplo |
|:------------|:------------|:----------------------|:--------|
| **TanStack Query** | Datos del servidor | Caché en memoria RAM | Productos, órdenes, categorías |
| **Zustand** | Datos del cliente | localStorage del navegador | Carrito de compras, tema oscuro, estado de UI |

**TanStack Query** se usa para datos que están en la base de datos de Django y se comparten entre usuarios (como el catálogo de productos). Cuando cambian, se vuelven a pedir al servidor.

**Zustand** se usa para datos que solo existen en el navegador del usuario (como su carrito de compras). No tiene sentido pedir al servidor el estado del carrito porque cada usuario tiene el suyo.

### ¿Por qué el carrito no se guarda en Django?

Podría, pero:
- El carrito cambia con cada click (agregar/quitar)
- Si cada click fuera una petición HTTP a Django, la app iría muy lenta
- Si el usuario no está logueado, no tendría carrito en el servidor

**Solución:** el carrito vive en Zustand con persist (localStorage) y solo se envía a Django al hacer checkout.

---

## 3.2 Zustand: create, set, get

### Para los que empiezan

Zustand crea un almacén global de estado fuera de los componentes de React. Cualquier componente puede leer o modificar ese almacén.

```
┌─────────────────────────────────────────┐
│           Zustand Store                  │
│                                         │
│  items: [                                │
│    { product_id: 1, name: "iPhone",     │
│      price: 999, quantity: 1 },          │
│  ]                                       │
│                                         │
│  Funciones: addItem, removeItem,         │
│             clearCart, getTotal          │
└─────────────────────────────────────────┘
           ▲                    │
           │                    │
    Componente A          Componente B
    (agrega al carrito)   (muestra el total)
```

### Desglose línea por línea

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

// create() crea el almacén (store)
// persist() guarda el store en localStorage automáticamente
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // --- Estado inicial ---
      items: [],       // El carrito empieza vacío

      // --- Funciones ---
      addItem: (item) =>
        set((state) => {
          // Buscar si el producto ya está en el carrito
          const existing = state.items.find(
            (i) => i.product_id === item.product_id
          );

          if (existing) {
            // Si ya está: AUMENTAR la cantidad
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          // Si no está: AGREGARLO
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),

      clearCart: () => set({ items: [] }),

      // get() lee el estado actual
      getTotal: () => get().items.reduce(
        (sum, i) => sum + i.price * i.quantity, 0
      ),

      getCount: () => get().items.reduce(
        (sum, i) => sum + i.quantity, 0
      ),
    }),
    {
      name: "cart-storage",          // ← Key en localStorage
      partialize: (state) => ({      // ← Solo guarda items
        items: state.items,
      }),
    }
  )
);
```

**Cada línea explicada:**

| Código | Significado |
|:-------|:------------|
| `create<CartState>()` | Crea un store con TypeScript. `<CartState>` define la forma del estado |
| `persist(...)` | Envuelve el store para guardarlo en localStorage automáticamente |
| `(set, get) => ({})` | `set` actualiza el estado, `get` lee el valor actual |
| `items: []` | El carrito empieza vacío |
| `addItem: (item) => set(...)` | Agrega un producto. `set` recibe el estado anterior y devuelve el nuevo |
| `state.items.find(...)` | Busca si el producto ya está en el carrito |
| `state.items.map(...)` | Si ya está, recorre todos los items y al que coincide le suma cantidad |
| `[...state.items, item]` | Si no está, crea un nuevo array con los items anteriores + el nuevo |
| `partialize` | Le dice a `persist` qué parte del estado guardar (solo items, no funciones) |

### Cómo se usa en los componentes

```tsx
"use client";
import { useCartStore } from "@/lib/stores/cart-store";

export default function CartButton() {
  // Leer solo UNA propiedad del store (para no re-renderizar de más)
  const count = useCartStore((s) => s.getCount());
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div>
      <span>Carrito: {count} items</span>
      <button onClick={() => addItem({ product_id: 1, name: "Test", price: 10, quantity: 1 })}>
        Agregar
      </button>
    </div>
  );
}
```

**¿Por qué `(s) => s.count` y no `const { count } = useCartStore()`?**

Porque `(s) => s.count` hace que el componente solo se re-renderice cuando CAMBIA `count`. La desestructuración `const { count, addItem } = useCartStore()` haría que se re-renderice cuando CAMBIA CUALQUIER COSA en el store.

### persist en acción

1. Agrega productos al carrito
2. Abre DevTools → Application → Local Storage → `cart-storage`
3. Verás los items guardados como JSON
4. Cierra y abre el navegador
5. El carrito sigue ahí — `persist` lo restauró desde localStorage

### Ejercicio

Agrega una función `updateQuantity(productId, quantity)` al store. Si la cantidad es 0 o menos, debe eliminar el item.

<details>
<summary>Solución</summary>

```ts
updateQuantity: (productId, quantity) =>
  set((state) => ({
    items:
      quantity <= 0
        ? state.items.filter((i) => i.product_id !== productId)
        : state.items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
  })),
```
</details>

---

## 3.3 Zod: validación de formularios

### Para los que empiezan

**Sin Zod**: el usuario escribe cualquier cosa, el formulario se envía, y recién en el servidor te das cuenta que los datos son inválidos.

**Con Zod**: antes de enviar, Zod revisa los datos. Si algo está mal, **no envía nada** y muestra el error al instante.

```
SIN Zod:
  Usuario escribe "abc" en el precio
  → Se envía a Django
  → Django responde "error: precio inválido"
  → El usuario esperó 500ms para recibir un error

CON Zod:
  Usuario escribe "abc" en el precio
  → Zod revisa: "esto no es un número"
  → Muestra error al instante (sin petición HTTP)
  → El usuario corrige al instante
```

### safeParse: la forma segura

Zod tiene dos formas de validar:

```ts
// parse: si falla, LANZA una excepción (se rompe TODO)
try {
  const data = schema.parse(input);
} catch (error) {
  // Toca hacer try/catch
}

// safeParse: si falla, DEVUELVE un resultado (no se rompe nada)
const result = schema.safeParse(input);
if (!result.success) {
  // result.error.issues → array de errores
  // result.error.issues[0].message → "El precio debe ser positivo"
  return; // ← No envía nada, el usuario ve el error
}
// result.data → datos validados y TIPADOS
```

**SIEMPRE usa `safeParse`** en el frontend. Es más seguro.

### Esquemas

```tsx
import { z } from "zod";

// Define las reglas de validación
export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

// TypeScript INFIERE el tipo automáticamente
export type LoginFormData = z.infer<typeof loginSchema>;
// → LoginFormData = { username: string; password: string }
```

**Cada validador de Zod:**

| Validador | Qué hace | Ejemplo |
|:----------|:---------|:--------|
| `z.string()` | Debe ser texto | `z.string()` |
| `z.string().min(3)` | Mínimo 3 caracteres | `z.string().min(3, "Mínimo 3")` |
| `z.string().email()` | Debe ser email válido | `z.string().email("Email inválido")` |
| `z.coerce.number()` | Convierte a número | `z.coerce.number().positive()` |
| `z.enum(["a", "b"])` | Solo permite esos valores | `z.enum(["one_time", "subscription"])` |
| `z.number().int()` | Debe ser entero | `z.number().int().positive()` |

### Integración en formularios

```tsx
"use client";

import { useState } from "react";
import { loginSchema } from "@/lib/schemas";
import { useAuth } from "@/hooks/use-auth";

export default function LoginForm() {
  const { login } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // 1. Leer datos del formulario
    const form = new FormData(e.currentTarget);
    const raw = {
      username: form.get("username") as string,
      password: form.get("password") as string,
    };

    // 2. Validar con Zod
    const result = loginSchema.safeParse(raw);

    // 3. Si hay errores, mostrarlos y NO enviar
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        // issue.path[0] = nombre del campo ("username", "password")
        // issue.message = mensaje de error
        fieldErrors[issue.path[0]?.toString() ?? "form"] = issue.message;
      }
      setErrors(fieldErrors);
      return;  // ← IMPORTANTE: no envía al servidor
    }

    // 4. result.data está validado y tipado
    //    Si llegas aquí, los datos SON correctos
    try {
      await login(result.data);
      router.push("/");
    } catch (err) {
      setErrors({ form: (err as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Usuario" />
      {errors.username && <p className="text-red-500">{errors.username}</p>}

      <input name="password" type="password" placeholder="Contraseña" />
      {errors.password && <p className="text-red-500">{errors.password}</p>}

      <button type="submit">Ingresar</button>
    </form>
  );
}
```

### Infer: tipos automáticos

Lo más potente de Zod: **los tipos TypeScript se generan solos** desde el esquema.

```tsx
const productSchema = z.object({
  name: z.string().min(3),
  price: z.coerce.number().positive(),
  category: z.number().int().positive(),
  product_type: z.enum(["one_time", "subscription"]),
});

// TypeScript INFIERE este tipo automático:
type ProductFormData = z.infer<typeof productSchema>;
// = { name: string; price: number; category: number; product_type: "one_time" | "subscription" }
```

**Ventaja:**
- Cambias el esquema Zod → los tipos cambian solos
- No puedes tener el tipo desactualizado
- El editor te autocompleta `result.data.name`, `result.data.price`, etc.

### Antes vs Después

**Sin Zod:**
```
Usuario escribe email "correo-invalido"
  → Se envía fetch POST a Django
  → Django responde 400 Bad Request
  → El usuario ve "error 400" (sin sentido)
  → Tiempo perdido: ~500ms de petición HTTP
```

**Con Zod:**
```
Usuario escribe email "correo-invalido"
  → safeParse → result.success = false
  → El usuario ve "Email inválido" al instante
  → NO se envía ninguna petición HTTP
  → Tiempo perdido: 0ms
```

### Ejercicio

Crea un esquema Zod para registrar usuario que valide:
- `username`: mínimo 3 caracteres
- `email`: debe ser email válido
- `password`: mínimo 8 caracteres

<details>
<summary>Solución</summary>

```ts
export const registerSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
```
</details>

---

# BLOQUE 4 — Backend (Django + JWT + Stripe)

---

## 4.1 Modelo: cómo se guardan los datos

### Para los que empiezan

Un **modelo** en Django es una clase de Python que Django convierte en una tabla en la base de datos.

```
En código Python:            En la base de datos (SQL):
────────────────────────────────────────────────────────
class Product(models.Model):   CREATE TABLE products_product (
    name = CharField(...)         name VARCHAR(...),
    price = DecimalField(...)     price DECIMAL(...),
    category = ForeignKey(...)    category_id INTEGER REFERENCES ...
                               );
```

Cada atributo de la clase es una columna de la tabla. Django maneja la creación de tablas automáticamente al ejecutar migraciones.

### Los modelos del proyecto

```python
# products/models.py
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)           # Texto, máximo 100 caracteres
    slug = models.SlugField(unique=True)               # Texto URL-amigable, único
    description = models.TextField(blank=True)          # Texto largo, opcional

    def __str__(self):
        return self.name   # ← Cómo se muestra en el admin

class Product(models.Model):
    # Opciones para el campo product_type
    class ProductType(models.TextChoices):
        ONE_TIME = "one_time", "One-time"
        SUBSCRIPTION = "subscription", "Subscription"

    category = models.ForeignKey(      # ← Relación: un producto pertenece a UNA categoría
        Category, on_delete=models.CASCADE, related_name="products"
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Número con decimales
    product_type = models.CharField(max_length=20, choices=ProductType.choices)
    stock = models.IntegerField(default=0)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Se llena solo al crear
```

**ForeignKey:** es una "flecha" hacia otra tabla. `category = ForeignKey(Category)` significa que cada Product apunta a una Category:

```
Product                       Category
────────────────────────      ────────────────────
name = "iPhone"       ───→    name = "Electrónica"
price = 999                   slug = "electronica"
category = 1 (id de Category)
```

### Migraciones: el historial de cambios

```bash
# 1. Django analiza tus modelos y prepara los cambios
python manage.py makemigrations
# → Crea archivos en products/migrations/0001_initial.py

# 2. Ejecuta los cambios en la base de datos
python manage.py migrate
# → Crea las tablas reales
```

**Cada vez que cambies un modelo**, debes correr estos dos comandos.

### Ejercicio

Agrega un campo `discount_price` (precio con descuento, opcional) al modelo Product. ¿Qué tipo de campo usarías?

<details>
<summary>Solución</summary>

```python
discount_price = models.DecimalField(
    max_digits=10, decimal_places=2, blank=True, null=True
)
```

Luego `makemigrations` y `migrate`.
</details>

---

## 4.2 Serializer: traductor Python ↔ JSON

### Para los que empiezan

Django guarda los datos como objetos de Python. El frontend necesita JSON. El **serializer** convierte de uno a otro:

```
Python (Django)                   JSON (para el frontend)
─────────────────────             ─────────────────────
Product(
  id=1,                           {
  name="iPhone",      ───→          "id": 1,
  price=Decimal("999"),             "name": "iPhone",
  category=<Category>,              "price": "999.00",
)                                   "category": 1,
                                  }
```

### Serializer de Product

```python
# products/serializers.py
from rest_framework import serializers
from .models import Product, Category, ProductImage

class ProductSerializer(serializers.ModelSerializer):
    # category_name NO existe en el modelo → se genera desde la relación
    category_name = serializers.CharField(
        source="category.name",  # ← Toma category.name y lo llama category_name
        read_only=True           # ← Solo lectura, no se puede escribir
    )

    # images NO es un campo directo, es una relación inversa
    images = ProductImageSerializer(
        many=True,               # ← Un producto puede tener varias imágenes
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id", "category", "category_name", "name", "slug",
            "description", "price", "product_type", "stock",
            "available", "images", "created_at",
        ]
```

**¿Por qué `category_name`?** Sin esto, el frontend recibiría solo el ID de la categoría (`category: 1`) y tendría que hacer OTRA petición para obtener el nombre. Con `category_name`, el nombre viene incluido en la misma respuesta.

**¿Qué devuelve la API?** Un JSON como este:

```json
{
  "id": 1,
  "category": 1,
  "category_name": "Electrónica",
  "name": "iPhone 15",
  "price": "999.00",
  "slug": "iphone-15",
  "images": [
    { "id": 1, "image": "/media/products/iphone.jpg", "is_primary": true }
  ]
}
```

### Ejercicio

¿Qué campo agregarías al serializer si quisieras que el frontend también reciba el stock total de la categoría?

<details>
<summary>Solución</summary>

```python
total_stock = serializers.IntegerField(
    source="category.products.count",  # ← Cuenta cuantos productos tiene la categoría
    read_only=True
)
```

O mejor:

```python
total_stock = serializers.SerializerMethodField()

def get_total_stock(self, obj):
    return obj.category.products.count()
```
</details>

---

## 4.3 ViewSet: las 5 operaciones en una clase

### Para los que empiezan

Cada ViewSet agrupa 5 operaciones CRUD:

| Petición HTTP | URL | Qué hace | Método del ViewSet |
|:--------------|:----|:---------|:-------------------|
| GET | `/api/products/` | Listar todos | `list()` |
| POST | `/api/products/` | Crear uno nuevo | `create()` |
| GET | `/api/products/{slug}/` | Ver detalle de uno | `retrieve()` |
| PUT | `/api/products/{slug}/` | Actualizar uno | `update()` |
| DELETE | `/api/products/{slug}/` | Eliminar uno | `destroy()` |

Con `ModelViewSet` obtienes las 5 gratis:

```python
from rest_framework import viewsets
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()            # ← Qué datos maneja
    serializer_class = CategorySerializer        # ← Cómo convertir a JSON

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "slug"  # ← En vez de /products/1 usa /products/iphone-15
```

### Permisos

No queremos que cualquiera pueda crear/editar/eliminar productos. Solo los admin.

```python
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # GET, HEAD, OPTIONS → cualquiera puede ver
        if request.method in permissions.SAFE_METHODS:
            return True
        # POST, PUT, DELETE → solo admin autenticado
        return request.user.is_authenticated and request.user.role == "admin"
```

Así lo usas:

```python
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    # ...
```

### Filtros

El ViewSet también puede filtrar datos según parámetros de la URL:

```python
class ProductViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # Si el usuario es staff (admin de Django), ve todos los productos
        # Si no, solo ve los disponibles
        qs = Product.objects.all() if self.request.user.is_staff else Product.objects.filter(available=True)

        # Filtro por categoría: /api/products/?category=electronica
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)

        # Filtro por tipo: /api/products/?product_type=one_time
        product_type = self.request.query_params.get("product_type")
        if product_type:
            qs = qs.filter(product_type=product_type)

        return qs
```

### Ejercicio

¿Qué URL usarías para obtener solo productos de la categoría "joyería" que sean suscripciones?

<details>
<summary>Solución</summary>

```
GET /api/products/?category=joyeria&product_type=subscription
```
</details>

---

## 4.4 Router: qué URL hace qué

### Para los que empiezan

El **router** conecta las URLs con los ViewSets. Cuando la app recibe una petición a `/api/products/`, el router la dirige a `ProductViewSet`.

```python
# products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet)   # /api/categories/ → CategoryViewSet
router.register(r"products", ProductViewSet)       # /api/products/ → ProductViewSet

urlpatterns = [
    path("", include(router.urls)),
]
```

Luego en `ecommerce_api/urls.py` se conecta todo:

```python
# ecommerce_api/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),                # /admin/ → Django admin
    path("api/", include("products.urls")),          # /api/ → products
    path("api/", include("accounts.urls")),          # /api/ → accounts
    path("api/", include("orders.urls")),            # /api/ → orders
    path("api/", include("payments.urls")),          # /api/ → payments
    path("api/token/", TokenObtainPairView.as_view()),  # /api/token/ → JWT login
]
```

### Mapa de URLs completo

| URL | ViewSet | Métodos |
|:----|:--------|:--------|
| `GET /api/products/` | ProductViewSet.list() | Lista productos |
| `POST /api/products/` | ProductViewSet.create() | Crea producto |
| `GET /api/products/iphone-15/` | ProductViewSet.retrieve() | Detalle |
| `PUT /api/products/iphone-15/` | ProductViewSet.update() | Actualiza |
| `DELETE /api/products/iphone-15/` | ProductViewSet.destroy() | Elimina |
| `GET /api/categories/` | CategoryViewSet.list() | Lista categorías |
| `POST /api/token/` | — | Login (JWT) |

### Ejercicio

Agrega un ViewSet para `Order` y regístralo en el router para que responda en `/api/orders/`.

<details>
<summary>Solución</summary>

```python
# orders/views.py
from rest_framework import viewsets
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

# orders/urls.py
router = DefaultRouter()
router.register(r"orders", OrderViewSet)

# En ecommerce_api/urls.py
path("api/", include("orders.urls")),
```
</details>

---

## 4.5 JWT: autenticación por tokens

### Concepto

JWT (JSON Web Token) es un string cifrado que demuestra que un usuario está autenticado.

```
Usuario envía:
  { "username": "admin", "password": "1234" }
                  │
                  ▼
Django verifica:
  - ¿Existe el usuario "admin"?
  - ¿La contraseña "1234" es correcta?
                  │
       ┌─────────┘
       ▼
Django genera un JWT (un string largo como este):
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4ifQ...

El JWT contiene información cifrada:
  { "user_id": 1, "role": "admin", "exp": 1700000000 }

El frontend guarda este JWT en localStorage.
En cada petición, lo envía en el header:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**¿Por qué JWT y no usuario/contraseña en cada petición?**

- El JWT expira (por defecto 1 hora)
- No necesitas enviar la contraseña en cada petición
- Django verifica el JWT sin consultar la BD (es más rápido)

### Configuración en Django

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),    # El token expira en 1 hora
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),   # Puedes renovarlo por 30 días
    "ROTATE_REFRESH_TOKENS": True,                   # Cada vez que renuevas, das uno nuevo
}
```

### Flujo completo de login en el frontend

```tsx
// hooks/use-auth.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, getMe } from "@/lib/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, revisa si hay un token guardado
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Si hay token, obtén los datos del usuario
      getMe()
        .then(setUser)
        .catch(() => {
          // Si el token es inválido/expirado, bórralo
          localStorage.removeItem("access_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (input) => {
    // 1. Envía username + password a Django
    const tokens = await loginApi(input);

    // 2. Guarda el JWT en localStorage
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);

    // 3. Obtiene los datos del usuario
    const me = await getMe();

    // 4. Guarda el usuario en el estado
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

**Flujo visual:**

```
1. Usuario escribe admin / 1234
2. Hace clic en "Ingresar"
3. POST /api/token/ → Django devuelve { access: "eyJ...", refresh: "eyJ..." }
4. Guarda access_token en localStorage
5. GET /api/users/me/ (con header Authorization: Bearer eyJ...)
6. Django devuelve { id: 1, username: "admin", role: "admin" }
7. setUser({ id: 1, username: "admin", role: "admin" })
8. Navbar ahora muestra "admin" y "Admin" en el menú
```

### Cómo se envía el token en cada petición

```ts
// lib/api.ts — función request()
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // 1. Obtener el token de localStorage
  const token = localStorage.getItem("access_token");

  // 2. Agregarlo al header
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;  // ← Aquí se manda

  // 3. Hacer la petición
  const res = await fetch(`http://localhost:8000/api${path}`, { ...options, headers });
  // ...
}
```

### Ejercicio

¿Qué pasa si el token expira (después de 1 hora)? ¿Cómo debería el frontend renovarlo?

<details>
<summary>Solución</summary>

Usar el `refresh_token` para obtener un nuevo `access_token`:

```ts
async function refreshToken() {
  const refresh = localStorage.getItem("refresh_token");
  const res = await fetch("/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}
```

Lo ideal es que el `request()` helper detecte un 401 (no autorizado) y automáticamente intente renovar el token antes de mostrar el error al usuario.
</details>

---

## 4.6 Guards: quién puede entrar

### Para los que empiezan

Un **guard** es un componente que protege una ruta. Si el usuario no cumple los requisitos, lo redirige a otra página.

Hay dos guards en el proyecto:

```
AuthGuard:
  - ¿Está logueado? → Sí → muestra la página
  - ¿No? → Redirige a /auth/login

AdminGuard:
  - ¿Está logueado Y es admin? → Sí → muestra la página
  - ¿No está logueado? → Redirige a /auth/login
  - ¿Está logueado pero no es admin? → Redirige a /
```

### AuthGuard

```tsx
"use client";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Verificando sesión...</p>;
  if (!user) {
    router.push("/auth/login");  // ← Redirige al login
    return null;
  }
  return <>{children}</>;  // ← Está logueado, muestra la página
}
```

### AdminGuard

```tsx
"use client";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  if (loading) return <p>Verificando...</p>;
  if (!user) {
    router.push("/auth/login");
    return null;
  }
  if (!isAdmin) {
    router.push("/");  // ← No es admin, lo mandamos al inicio
    return null;
  }
  return <>{children}</>;
}
```

### Cómo se usan

```tsx
// app/orders/page.tsx — solo logueados
export default function OrdersPage() {
  return (
    <AuthGuard>
      <h1>Mis Órdenes</h1>
      {/* ... */}
    </AuthGuard>
  );
}

// app/admin/products/page.tsx — solo admin
export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <h1>Panel de Productos</h1>
      {/* ... */}
    </AdminGuard>
  );
}
```

### Ejercicio

¿Qué guard usarías para una página de perfil de usuario? ¿Y para una de configuración del sistema?

<details>
<summary>Solución</summary>

- Perfil de usuario → `AuthGuard` (cualquier logueado)
- Configuración del sistema → `AdminGuard` (solo administradores)
</details>

---

## 4.7 Stripe: cómo se pagan los productos

### Para los que empiezan

Stripe es el procesador de pagos. El flujo completo:

```
1. Usuario va al carrito y hace clic en "Pagar"
2. Next.js crea una "sesión de pago" en Stripe
3. Stripe devuelve una URL (ej: https://checkout.stripe.com/c/xxx)
4. El usuario es redirigido a Stripe
5. El usuario pone su tarjeta EN Stripe (no en tu web)
6. Stripe procesa el pago
7. Stripe redirige al usuario de vuelta a /success
8. Stripe NOTIFICA a Django mediante un webhook: "el pago fue exitoso"
9. Django marca la orden como "paid"
```

**¿Por qué Stripe maneja la tarjeta directamente?**
- Por seguridad: nunca ves ni guardas el número de tarjeta
- Stripe está certificado (PCI DSS), tu web no necesita estarlo

### Paso 1: API Route en Next.js

Crea `app/api/checkout/route.ts`:

```tsx
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializa Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { items, mode } = await req.json();

  // Crea una sesión de pago en Stripe
  const session = await stripe.checkout.sessions.create({
    mode,  // "payment" (pago único) o "subscription" (suscripción)
    line_items: items.map((i: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100), // Stripe usa centavos ($10 = 1000)
      },
      quantity: i.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
  });

  return NextResponse.json({ url: session.url });  // ← Devuelve la URL de Stripe
}
```

### Paso 2: El frontend redirige

```tsx
// app/checkout/page.tsx
const handleCheckout = async () => {
  const { url } = await createCheckoutSession({
    items: cartItems.map(i => ({
      product_id: i.product_id,
      quantity: i.quantity,
    })),
    mode: "payment",
  });
  window.location.href = url;  // ← Redirige a Stripe
};
```

### Paso 3: Webhook en Django

El webhook es una URL en Django que Stripe llama automáticamente cuando un pago se completa.

```python
# payments/views.py
import stripe
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["POST"])
def stripe_webhook(request):
    # Verifica que la petición realmente vino de Stripe (no de un hacker)
    event = stripe.Webhook.construct_event(
        request.body,
        request.META["HTTP_STRIPE_SIGNATURE"],
        settings.STRIPE_WEBHOOK_SECRET
    )

    # ¿Qué tipo de evento es?
    if event["type"] == "checkout.session.completed":
        # El pago fue exitoso
        session = event["data"]["object"]
        order_id = session["metadata"]["order_id"]
        order = Order.objects.get(id=order_id)
        order.status = "paid"
        order.save()

    return Response({"status": "ok"})
```

**¿Por qué un webhook y no solo redirigir a /success?**
- El usuario podría cerrar el navegador después de pagar y antes de la redirección
- Un webhook es CONFIRMACIÓN DIRECTA de Stripe: "el pago sí ocurrió"
- La redirección a /success podría ser falsificada

### Tarjetas de prueba

| Tarjeta | Resultado |
|:--------|:----------|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 0002` | Pago rechazado |
| `4000 0025 0000 3155` | Requiere autenticación (3D Secure) |

Cualquier fecha futura y cualquier CVC de 3 dígitos funcionan.

### Ejercicio

¿Qué evento de Stripe usarías para detectar que una suscripción fue cancelada?

<details>
<summary>Solución</summary>

`customer.subscription.deleted` — se dispara cuando una suscripción termina (por cancelación o por impago).
</details>

---

# BLOQUE 5 — Cómo se conecta TODO

---

## 5.1 Mapa mental del proyecto

```
                    ┌──────────────────────────────────────┐
                    │           NEXT.JS (:3000)             │
                    │                                      │
                    │  TanStack Query (useQuery/useMutation)│
                    │    ├── Productos ─── GET /api/products/│
                    │    ├── Órdenes   ─── GET /api/orders/ │
                    │    └── Categorías ─ GET /api/categories│
                    │                                      │
                    │  Zustand (carrito + tema)             │
                    │    ├── Carrito → localStorage         │
                    │    └── Tema    → localStorage         │
                    │                                      │
                    │  Zod (validación en formularios)      │
                    │    ├── Login → valida antes de enviar │
                    │    └── Producto → valida antes de POST│
                    │                                      │
                    │  Auth Context (JWT)                   │
                    │    ├── login → guarda token           │
                    │    └── AuthGuard / AdminGuard         │
                    └──────────────┬───────────────────────┘
                                   │
                    fetch() con    │
                    Bearer token   │
                                   ▼
                    ┌──────────────────────────────────────┐
                    │           DJANGO (:8000)               │
                    │                                      │
                    │  accounts/ → User, JWT, Register      │
                    │  products/ → Product, Category, CRUD  │
                    │  cart/     → Cart, CartItem           │
                    │  orders/   → Order, OrderItem         │
                    │  payments/ → Payment, Stripe webhook  │
                    └──────────────┬───────────────────────┘
                                   │
                              ORM  │
                                   ▼
                    ┌──────────────────────────────────────┐
                    │           BASE DE DATOS               │
                    │    (SQLite en dev, PostgreSQL en prod) │
                    └──────────────────────────────────────┘
```

---

## 5.2 Camino de un clic

Sigue el camino de un clic en "Agregar al Carrito" desde que el usuario hace clic hasta que el dato se guarda:

```
USUARIO HACE CLIC en "+ Carrito"
        │
        ▼
1. ProductCard.tsx → onClick={handleAdd}
   │
   ▼
2. useCartStore.addItem({
     product_id: 1,
     name: "iPhone 15",
     price: 999,
     quantity: 1
   })
   │
   ▼
3. Zustand actualiza el estado:
   items: [{ product_id: 1, name: "iPhone 15", ... }]
   │
   ▼
4. El Navbar se RE-RENDERIZA:
   cartCount cambió de 0 a 1
   Aparece el badge rojo "1"
   │
   ▼
5. Zustand PERSIST guarda en localStorage (key: "cart-storage"):
   { "state": { "items": [{ "product_id": 1, ... }] } }
   │
   ▼
6. Usuario recarga la página → el carrito sigue ahí
   │
   ▼
7. USUARIO VA AL CHECKOUT
   │
   ▼
8. Checkout page → lee items de useCartStore
   ──────────────────── LÍMITE: ZUSTAND → TANSTACK QUERY ─────
   │
   ▼
9. createCheckoutSession() → POST /api/checkout
   │
   ▼
10. Next.js API Route recibe los items y crea sesión en Stripe
    │
    ▼
11. Stripe devuelve URL → redirige al usuario a stripe.com
    │
    ▼
12. Usuario paga en Stripe
    │
    ▼
13. Stripe llama al WEBHOOK en Django
    POST /api/webhooks/stripe/ → event = "checkout.session.completed"
    │
    ▼
14. Django: Order.status = "paid", Payment.objects.create(...)
    │
    ▼
15. Usuario vuelve a /success
    │
    ▼
16. useCartStore.clearCart() → carrito vacío
```

---

## 5.3 Guía de arranque rápido

```bash
# 1. Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data       # 20 productos desde FakeStore
python manage.py runserver

# 2. Frontend
cd frontend
npm install
npm run dev

# 3. Abrir en el navegador
# Frontend: http://localhost:3000
# Admin Django: http://localhost:8000/admin/ (usuario: admin, pass: 1234)
# Admin App: http://localhost:3000/admin/
```

### Resumen de herramientas

| Herramienta | ¿Qué hace? | ¿Por qué la usamos? |
|:------------|:-----------|:--------------------|
| **Next.js** | Framework de React con App Router | Rutas automáticas, Server Components, API Routes |
| **Tailwind** | CSS en clases | Escribimos estilos en el HTML, sin archivos CSS separados |
| **TanStack Query** | Caché de datos del servidor | Evita fetch repetitivos, refetch automático, menos código |
| **Zustand** | Estado del cliente | Carrito persistente, tema oscuro, UI state |
| **Zod** | Validación de formularios | Errores al instante, tipos TypeScript automáticos |
| **Django** | Backend + API REST | Modelos, serializers, viewsets, autenticación JWT |
| **Stripe** | Procesador de pagos | Pagos seguros, tarjetas nunca tocan tu servidor |
