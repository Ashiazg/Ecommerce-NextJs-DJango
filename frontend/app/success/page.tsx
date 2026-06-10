import { Card, Button } from "@/components/ui";

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="text-center">
        <Card.Body>
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-text mb-2">¡Pago Exitoso!</h1>
          <p className="text-text-muted mb-6">
            Gracias por tu compra. Recibirás un correo con los detalles.
          </p>
          <div className="flex gap-3 justify-center">
            <Button href="/products" variant="primary">Seguir Comprando</Button>
            <Button href="/orders" variant="secondary">Ver Órdenes</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
