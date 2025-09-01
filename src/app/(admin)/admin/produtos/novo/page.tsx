// src/app/(admin)/admin/produtos/novo/page.tsx
'use client';

import { useState } from 'react';
import { createProduct } from './actions'; 

type StockVariant = {
  size: string;
  price: number;
  quantity: number;
};

export default function NewProductPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [variants, setVariants] = useState<StockVariant[]>([
        { size: 'P', price: 0, quantity: 0 },
    ]);
    // A LINHA QUE ESTAVA FALTANDO É ESTA:
    const [isLoading, setIsLoading] = useState(false);

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
  
    // handleSubmit simplificado, sem try...catch
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const productData = {
        name,
        description,
        stock_by_size: variants.filter(v => v.size),
        };
        
        // Simplesmente chamamos a ação. Se der certo, ela vai redirecionar.
        // Se der um erro de verdade no servidor, a página não vai redirecionar.
        await createProduct(productData);

        // Se a ação falhar e não redirecionar, podemos reativar o botão
        // (embora o ideal seja usar useActionState para tratar erros do servidor)
        setIsLoading(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
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
                <h2 className="text-lg font-semibold mb-2">Estoque por Tamanho (TAMANHO, PREÇO, QUANTIDADE)</h2>
                <div className="space-y-4">
                    {variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded">
                        <input type="text" placeholder="Tamanho (ex: M)" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="p-2 w-1/4 rounded bg-gray-600" />
                        <input type="number" placeholder="Preço" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)} className="p-2 w-1/4 rounded bg-gray-600" />
                        <input type="number" placeholder="Quantidade" value={variant.quantity} onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value) || 0)} className="p-2 w-1/4 rounded bg-gray-600" />
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
                    {isLoading ? 'Salvando...' : 'Salvar Produto'}
                </button>
                </div>
            </form>
        </div>
    );
}