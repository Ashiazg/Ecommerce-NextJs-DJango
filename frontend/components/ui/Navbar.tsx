"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useCartStore } from "@/lib/stores/cart-store";
import UserMenu from "@/components/UserMenu";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const cartCount = useCartStore((s) => s.getCount());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const links = [
    { label: "Productos", href: "/products" },
  ];

  return (
    <>
      <nav className="bg-surface border-b border-border px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-primary text-lg">
            EcommerceApp
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-alt transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition"
              aria-label="Carrito"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition text-lg hidden sm:block"
              aria-label="Cambiar tema"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <UserMenu />

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition sm:hidden"
              aria-label="Menú"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden border-t border-border pb-3 pt-2 space-y-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-alt transition"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-alt transition"
            >
              {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
            </button>
          </div>
        )}
      </nav>
      <CartDrawer />
    </>
  );
}
