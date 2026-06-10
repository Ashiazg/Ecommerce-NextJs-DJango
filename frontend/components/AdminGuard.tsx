"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/auth/login");
    else if (!isAdmin) router.push("/");
  }, [user, loading, isAdmin, router]);

  if (loading) return <p className="text-text-muted p-8 text-center">Verificando acceso...</p>;
  if (!user || !isAdmin) return null;

  return <>{children}</>;
}
