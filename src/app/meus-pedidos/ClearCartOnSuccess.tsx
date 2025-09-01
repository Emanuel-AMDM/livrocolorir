// src/app/meus-pedidos/ClearCartOnSuccess.tsx
'use client';

import { useCartStore } from '@/store/cartStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClearCartOnSuccess() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // 1. Verifica se o parâmetro 'success=true' existe na URL
    if (searchParams.get('success') === 'true') {
      console.log('Compra bem-sucedida! Limpando o carrinho...');
      // 2. Chama a ação para limpar o carrinho
      clearCart();
      // 3. Remove o parâmetro da URL para não limpar de novo ao recarregar a página
      // Usamos 'replace' para não adicionar uma nova entrada no histórico do navegador
      router.replace('/meus-pedidos');
    }
  }, [searchParams, clearCart, router]);

  // Este componente não renderiza nada na tela, ele apenas executa a lógica.
  return null;
}