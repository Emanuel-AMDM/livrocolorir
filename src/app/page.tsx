// src/app/page.tsx

import Link from 'next/link';
// Vamos usar o cliente mais básico do Supabase aqui
import { createClient } from '@supabase/supabase-js';
import AddToCartButton from '@/components/AddToCartButton';
//Importe o cliente de servidor para buscar o usuário
import { createSupabaseServerClient } from '@/lib/supabase/server';

type Product = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  price: number;
};

export default async function HomePage() {
  // Criando um cliente anônimo SIMPLES, apenas para buscar dados públicos.
  // Ele não tenta gerenciar cookies ou sessão.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // O resto do código funciona como antes
  const { data: products, error } = await supabase.from('products').select('*');

  //Cliente de servidor para buscar o usuário logado
  const supabaseServer = createSupabaseServerClient();
  const {data: {user}} = await supabaseServer.auth.getUser();

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return <p>Ocorreu um erro ao carregar os produtos.</p>;
  }

  if (!products || products.length === 0) {
    return <p>Nenhum produto encontrado.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nossos Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <Link href={`/produtos/${product.id}`} key={product.id}>
            <div key={product.id} className="border p-4 rounded-lg shadow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600 my-2">{product.description}</p>
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(product.price)}
                </p>
              </div>
              <AddToCartButton product={product}/>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}