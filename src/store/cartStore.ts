//src/store/cartStore.ts
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

//Definimos o tipo para um item do carrinho, que inclui a quantidade
type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

//Definimos o estado do nosso store
type CartState = {
    items: CartItem[];
    addItem: (item: {id: number; name: string; price: number}) => void;
    removeItem: (itemId: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>()(
    //`persist` é um middleware do zustand. Ele vai automaticamente
    //salvar o estado do carrinho no localStorage do navegador.
    //Isso significa que se o usuário fechar a aba e voltar, o carrinho dele ainda estará lá!
    persist(
        (set) => ({
            items: [], //Estado inicial: carrinho vazio

            //Ação para adicionar um item
            addItem: (product) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);

                    if(existingItem) {
                        //Se o item já existe, apenas aumenta a quantidade
                        const updateItems = state.items.map((item) =>
                        item.id === product.id
                        ?{...item, quantity: item.quantity + 1}
                        : item
                    );
                    return {items: updateItems};
                    }else{
                        //Se for um item novo, adiciona à lista com quantidade 1
                        return {items: [...state.items, {...product, quantity: 1}]};
                    }
                }),
            
                //Ação para remover um item completamente
                removeItem: (itemId) =>
                    set((state) => ({
                        items: state.items.filter((item) => item.id !== itemId),
                    })),
                    
                //Ação para limpar o carrinho todo
                clearCart: () => set({items: []}),
        }),
        {
            name: 'cart-storage', //Nome da chave no localStorage
        }
    )
);