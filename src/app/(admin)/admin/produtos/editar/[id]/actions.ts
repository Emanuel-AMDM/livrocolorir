// Caminho do arquivo:
// src/app/(admin)/admin/produtos/editar/[id]/actions.ts

'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// O tipo de dado do produto
type ProductData = {
  name: string;
  description: string;
  stock_by_size: {
    size: string;
    price: number;
    quantity: number;
  }[];
};

// A ação recebe o ID do produto que será atualizado e os novos dados
export async function updateProduct(id: number, productData: ProductData) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from('products')
    .update({
      name: productData.name,
      description: productData.description,
      stock_by_size: productData.stock_by_size,
    })
    .eq('id', id); // A condição .eq() garante que estamos atualizando o produto certo

  if (error) {
    console.error('Erro ao atualizar produto:', error);
    return { error: 'Não foi possível atualizar o produto.' };
  }

  console.log(`Produto ${id} atualizado com sucesso.`);

  // Limpa o cache das páginas de listagem e de edição para refletir as mudanças
  revalidatePath('/admin/produtos');
  revalidatePath(`/admin/produtos/editar/${id}`);

  // Redireciona de volta para a lista
  redirect('/admin/produtos');
}