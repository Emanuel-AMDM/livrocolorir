// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// Vamos usar o createClient básico para criar um cliente admin
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Criamos um cliente Supabase com privilégios de administrador
// Ele usará a chave de serviço e pode ignorar as políticas de RLS.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const buf = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Usamos o cliente admin para inserir os dados no banco
      const { error } = await supabaseAdmin
        .from('orders')
        .insert({
          stripe_session_id: session.id,
          amount: session.amount_total,
          status: 'completed',
          user_id: session.client_reference_id,
        });
      
      if (error) {
        console.error('Erro ao salvar pedido no Supabase:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      
      console.log(`Pedido ${session.id} salvo com sucesso!`);

    } catch (dbError) {
      console.error('Erro de banco de dados:', dbError);
      return NextResponse.json({ error: 'Database server error' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}