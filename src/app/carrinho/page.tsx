//src/app/carrinho/page.tsx
'use client';

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useState } from "react";

//Importando o Cliente do Supabase para o lado do cliente
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

//Importando o loadStripe para redirecionar
import { loadStripe } from "@stripe/stripe-js";

export default function CartPage(){
    const {items, removeItem, clearCart} = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    //Calcula o valor total do carrinho
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = async () => {
      setIsLoading(true);
      const supabase = createClient();

      //Pega a sessão do usuario no lado do cliente
      const {data: {user}} = await supabase.auth.getUser();

      if(!user){
        router.push('/login?redirect=/carrinho');
        return;
      }

    try{
      const response = await fetch('/api/checkout_sessions',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({items, userId: user.id}), //Envia todos os itens e o userId
      });

      const {sessionId} = await response.json();

      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
      } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
        alert('Não foi possível iniciar o pagamento.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>

      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Seu carrinho está vazio.</p>
          <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna dos Itens do Carrinho */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-400">Quantidade: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-400 text-sm font-semibold mt-1"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coluna do Resumo do Pedido */}
          <div className="bg-gray-800 p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Resumo do Pedido</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Subtotal</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-400">Frete</span>
              <span>Grátis</span>
            </div>
            <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded w-full mt-6"
            >
              Finalizar Compra
            </button>
            <button
              onClick={() => clearCart()}
              className="text-gray-400 hover:text-white text-sm font-semibold mt-4 w-full"
            >
              Limpar Carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}