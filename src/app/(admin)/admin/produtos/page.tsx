// src/app/(admin)/admin/produtos/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';

// Tipos (sem alteração)
type StockVariant = {
  size: string;
  price: number;
  quantity: number;
};

type Product = {
  id: number;
  name: string;
  stock_by_size: StockVariant[] | null; // Adicionado | null para segurança
};

export default async function AdminProductsPage() {
  const supabase = createSupabaseServerClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, stock_by_size')
    .order('id', { ascending: true });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return <p className="text-red-500">Não foi possível carregar os produtos.</p>;
  }
  
  // A função para calcular o estoque total não é mais necessária, podemos removê-la.

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Produtos</h1>
        <Link href="/admin/produtos/novo" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          + Novo Produto
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nome</th>
              {/* MUDANÇA AQUI: Trocamos o nome da coluna */}
              <th className="p-4">Estoque Detalhado (Tamanho: Qtd)</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((product: Product) => (
              <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="p-4 align-top">{product.id}</td>
                <td className="p-4 font-semibold align-top">{product.name}</td>
                
                {/* MUDANÇA PRINCIPAL AQUI */}
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {/* Verificamos se 'stock_by_size' existe e não está vazio */}
                    {product.stock_by_size && product.stock_by_size.length > 0 ? (
                      product.stock_by_size.map((variant) => (
                        <span 
                          key={variant.size} 
                          className="bg-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                        >
                          {variant.size}: {variant.quantity}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Sem estoque</span>
                    )}
                  </div>
                </td>

                <td className="p-4 align-top">
                  <Link href={`/admin/produtos/editar/${product.id}`} className="text-green-400 hover:text-green-300">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}