import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { items, mode = "payment" } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const lineItems = items.map(
      (item: { product_id: number; quantity: number }) => ({
        price: `price_${item.product_id}`,
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
