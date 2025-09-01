// Caminho do arquivo:
// src/app/(admin)/admin/produtos/editar/[id]/page.tsx

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createSupabaseServerClient();

  // Busca os dados do produto específico para pré-preencher o formulário
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // Se o produto não existir, mostra uma página 404
  if (!product) {
    notFound();
  }

  // Renderiza o formulário, passando os dados do produto para ele
  return <EditProductForm product={product} />;
}