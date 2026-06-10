"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema } from "@/lib/schemas";
import { Card, Input, Button } from "@/components/ui";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const form = new FormData(e.currentTarget);
    const raw = {
      username: form.get("username") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
    };
    const result = registerSchema.safeParse(raw);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]?.toString() ?? "form"] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await register(result.data);
      router.push("/");
    } catch (err) {
      setApiError((err as Error).message);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-12">
      <Card>
        <Card.Header>Crear Cuenta</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="username" label="Usuario" placeholder="usuario123" error={errors.username} />
            <Input name="email" label="Email" type="email" placeholder="tu@email.com" error={errors.email} />
            <Input name="password" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" error={errors.password} />
            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
            <Button type="submit" variant="primary" className="w-full">Crear Cuenta</Button>
          </form>
        </Card.Body>
        <Card.Footer className="justify-center">
          <p className="text-sm text-text-muted">
            ¿Ya tienes cuenta? <a href="/auth/login" className="text-primary hover:underline">Ingresa</a>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
}
