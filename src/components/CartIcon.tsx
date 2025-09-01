// src/components/CartIcon.tsx
'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

const ShoppingBagIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
    />
  </svg>
);

export default function CartIcon() {
  const { items } = useCartStore();
  // 1. Criamos um estado para saber se o componente já "montou" no cliente
  const [hasMounted, setHasMounted] = useState(false);

  // 2. Este efeito só roda no cliente, após a primeira renderização
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 3. Se o componente ainda não montou, renderizamos um placeholder
  //    (o ícone sem o número). Isso garante que o servidor e o cliente
  //    renderizem a mesma coisa inicialmente.
  if (!hasMounted) {
    return (
      <Link href="/carrinho" className="relative">
        <ShoppingBagIcon />
      </Link>
    );
  }

  // 4. Após montar, o componente re-renderiza, e agora podemos
  //    calcular e mostrar o total de itens com segurança.
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/carrinho" className="relative">
      <ShoppingBagIcon />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}