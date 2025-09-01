// src/components/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

// Definimos o tipo do produto que este botão receberá
type Product = {
  id: number;
  name: string;
  price: number;
};

export default function AddToCartButton({ product }: { product: Product }) {
  // Pegamos a ação 'addItem' do nosso store
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  //Afunção agora recebe o evento 'e' do clique
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    //Esta linha impede que o clique "borbulhe" para o Link pai
    e.stopPropagation();
    e.preventDefault(); //Tambem previne qualquer comportamento padrão
    
    addItem(product);
    setAdded(true);

    // Reseta o estado do botão após 2 segundos
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={added}
      className={`font-bold py-2 px-4 rounded mt-4 w-full transition-colors duration-300 ${
        added
          ? 'bg-green-500 text-white cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-700 text-white'
      }`}
    >
      {added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
    </button>
  );
}