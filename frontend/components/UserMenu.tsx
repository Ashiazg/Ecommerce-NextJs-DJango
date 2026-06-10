"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui";

export default function UserMenu() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" href="/auth/login">Ingresar</Button>
        <Button variant="primary" href="/auth/register">Registrarse</Button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition"
      >
        <span className="w-7 h-7 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
          {user.email[0].toUpperCase()}
        </span>
        <span className="text-sm hidden sm:inline">{user.email}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg py-1 z-50">
          <Link href="/account" className="block px-4 py-2 text-sm text-text hover:bg-surface-alt" onClick={() => setOpen(false)}>
            Mi Perfil
          </Link>
          <Link href="/orders" className="block px-4 py-2 text-sm text-text hover:bg-surface-alt" onClick={() => setOpen(false)}>
            Mis Órdenes
          </Link>
          {isAdmin && (
            <Link href="/admin/products" className="block px-4 py-2 text-sm text-text hover:bg-surface-alt" onClick={() => setOpen(false)}>
              Admin Productos
            </Link>
          )}
          <hr className="border-border my-1" />
          <button
            onClick={() => { setOpen(false); logout(); }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-surface-alt"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
