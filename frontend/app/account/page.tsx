"use client";

import { Card, Button } from "@/components/ui";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/use-auth";

function AccountContent() {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">Mi Cuenta</h1>
      <Card>
        <Card.Body className="space-y-4">
          <div>
            <label className="text-sm text-text-muted">Email</label>
            <p className="font-medium text-text">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted">Usuario</label>
            <p className="font-medium text-text">{user?.username}</p>
          </div>
          <div>
            <label className="text-sm text-text-muted">Rol</label>
            <p className="font-medium text-text">{user?.role}</p>
          </div>
        </Card.Body>
        <Card.Footer>
          <Button variant="secondary" href="/orders">Mis Órdenes</Button>
          {user?.role === "admin" && (
            <Button variant="primary" href="/admin/products">Admin</Button>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}
