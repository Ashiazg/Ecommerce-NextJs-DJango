"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  role?: "admin" | "customer";
  fallback?: ReactNode;
};

export default function AuthGuard({ children, role, fallback }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/auth/login");
    else if (role && user.role !== role) router.push("/");
  }, [user, loading, role, router]);

  if (loading) return <p className="text-text-muted p-8 text-center">Verificando acceso...</p>;
  if (!user) return fallback || null;
  if (role && user.role !== role) return null;

  return <>{children}</>;
}
