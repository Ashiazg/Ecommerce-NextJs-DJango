import Link from "next/link";
import { Button, Card } from "@/components/ui";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-secondary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative px-8 py-16 sm:py-24 text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Tu Tienda Online
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg mx-auto">
            Descubre productos únicos con pagos seguros, envíos rápidos y la mejor experiencia de compra.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button href="/products" variant="primary" className="bg-white text-primary hover:bg-white/90 !px-8 !py-3 text-base">
              Explorar Productos
            </Button>
            <Button href="/auth/register" variant="ghost" className="text-white border border-white/30 hover:bg-white/10 !px-8 !py-3 text-base">
              Crear Cuenta
            </Button>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <CategoriesSection />

      {/* Productos Destacados */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Productos Destacados</h2>
          <Link href="/products" className="text-primary hover:text-primary-dark text-sm font-medium">
            Ver todos →
          </Link>
        </div>
        <ProductGrid limit={6} />
      </section>
    </div>
  );
}

async function CategoriesSection() {
  let categories: { id: number; name: string; slug: string; description: string }[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, {
      next: { revalidate: 60 },
    });
    if (res.ok) categories = await res.json();
  } catch {}

  if (!categories.length) return null;

  const icons: Record<string, string> = {
    electrónica: "🔌",
    joyería: "💎",
    "ropa hombre": "👔",
    "ropa mujer": "👗",
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-text mb-6">Categorías</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.slug}`}>
            <Card className="text-center py-8 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
              <Card.Body>
                <span className="text-4xl block mb-2">{icons[cat.name.toLowerCase()] ?? "🏷️"}</span>
                <h3 className="font-semibold text-text">{cat.name}</h3>
                <p className="text-xs text-text-muted mt-1">{cat.description}</p>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
