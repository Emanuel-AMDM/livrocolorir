// Caminho do arquivo:
// src/app/(admin)/admin/produtos/editar/[id]/EditProductForm.tsx

'use client';

import { useState } from 'react';
import { updateProduct } from './actions';

// Tipos para o produto e variantes
type StockVariant = { size: string; price: number; quantity: number; };
type Product = {
  id: number;
  name: string;
  description: string | null;
  stock_by_size: StockVariant[] | null;
};

export default function EditProductForm({ product }: { product: Product }) {
  // O estado inicial agora usa os dados do produto que recebemos via props
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [variants, setVariants] = useState<StockVariant[]>(product.stock_by_size || []);
  const [isLoading, setIsLoading] = useState(false);

  // Funções para gerenciar as variantes de tamanho
  const handleVariantChange = (index: number, field: keyof StockVariant, value: string | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: 0, quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const productData = { name, description, stock_by_size: variants.filter(v => v.size) };
    
    await updateProduct(product.id, productData);
    
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Produto: <span className="text-blue-400">{product.name}</span></h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-6">
        {/* Campo Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nome da Camiseta</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            required
          />
        </div>

        {/* Campo Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            rows={4}
          />
        </div>
        
        {/* Seção de Variantes */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Estoque por Tamanho</h2>
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded">
                <input type="text" placeholder="Tamanho (ex: M)" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="p-2 w-1/4 rounded bg-gray-600" />
                <input type="number" step="0.01" placeholder="Preço" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)} className="p-2 w-1/4 rounded bg-gray-600" />
                <input type="number" placeholder="Quantidade" value={variant.quantity} onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value, 10) || 0)} className="p-2 w-1/4 rounded bg-gray-600" />
                <button type="button" onClick={() => removeVariant(index)} className="text-red-500 font-bold">X</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addVariant} className="mt-4 bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded text-sm">
            + Adicionar Tamanho
          </button>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <button 
            type="submit" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando Alterações...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}