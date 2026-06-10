"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/ui";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Productos", icon: "🛍️" },
  { href: "/admin/categories", label: "Categorías", icon: "🏷️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-56 shrink-0 bg-surface-alt border-r border-border hidden md:block">
          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text-muted hover:text-text hover:bg-surface"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}
