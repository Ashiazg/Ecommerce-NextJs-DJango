"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@/lib/schemas";
import { Card, Input, Button } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const form = new FormData(e.currentTarget);
    const raw = { username: form.get("username") as string, password: form.get("password") as string };
    const result = loginSchema.safeParse(raw);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]?.toString() ?? "form"] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await login(result.data);
      router.push("/");
    } catch (err) {
      setApiError((err as Error).message);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-12">
      <Card>
        <Card.Header>Iniciar Sesión</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="username" label="Usuario" type="text" placeholder="tu_usuario" error={errors.username} />
            <Input name="password" label="Contraseña" type="password" placeholder="********" error={errors.password} />
            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
            <Button type="submit" variant="primary" className="w-full">Ingresar</Button>
          </form>
        </Card.Body>
        <Card.Footer className="justify-center">
          <p className="text-sm text-text-muted">
            ¿No tienes cuenta? <a href="/auth/register" className="text-primary hover:underline">Regístrate</a>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
}
