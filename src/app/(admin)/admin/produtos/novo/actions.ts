// src/app/(admin)/admin/produtos/novo/actions.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Definimos o tipo de dado que esperamos do formulário
type ProductData = {
  name: string;
  description: string;
  stock_by_size: {
    size: string;
    price: number;
    quantity: number;
  }[];
};

export async function createProduct(productData: ProductData) {
  const supabase = createSupabaseServerClient();

  // 1. Inserimos os dados básicos na tabela 'products'
  //    Note que o 'stock_by_size' já é enviado no formato JSONB correto
  const { data: newProduct, error } = await supabase
    .from('products')
    .insert([
      {
        name: productData.name,
        description: productData.description,
        stock_by_size: productData.stock_by_size,
      },
    ])
    .select()
    .single();

  // 2. Tratamos possíveis erros na inserção
  if (error) {
    console.error('Erro ao criar produto:', error);
    // Poderíamos retornar uma mensagem de erro específica no futuro
    return { error: 'Não foi possível cadastrar o produto.' };
  }

  console.log('Produto criado com sucesso:', newProduct);

  // 3. Limpamos o cache da página de listagem de produtos
  //    Isso força o Next.js a buscar os dados novamente na próxima visita,
  //    garantindo que a lista esteja sempre atualizada.
  revalidatePath('/admin/produtos');

  // 4. Redirecionamos o usuário de volta para a página de listagem
  redirect('/admin/produtos');
}