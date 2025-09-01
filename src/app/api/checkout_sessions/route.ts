// src/app/api/checkout_sessions/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const { items, userId } = await request.json();

  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: 'brl',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: userId,
      success_url: `${request.headers.get('origin')}/meus-pedidos?success=true`,
      cancel_url: `${request.headers.get('origin')}/carrinho`,
    });

    return NextResponse.json({ sessionId: session.id });

  // A correção está aqui: removemos o '=>'
  } catch (err) {
    console.error('Erro ao criar sessão de checkout:', err);
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout' }, { status: 500 });
  }
}