//src/app/meus-pedidos/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClearCartOnSuccess from "./ClearCartOnSuccess";

//Definindo um "tipo" para o nosso pedido
type Order = {
    id: number;
    created_at: string;
    amount: number;
    status: string;
    stripe_session_id: string;
};

export default async function MeusPedidosPage(){
    const supabase = createSupabaseServerClient();

    //1.Proteger a rota: buscar o usuário
    const {data: {user}} = await supabase.auth.getUser();

    //Se não houver usuário, redireciona para a página de login
    if(!user){
        redirect('/login');
    }

    //2. Buscar os pedidos do usuário logado
    const {data: orders, error} = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id) //O filtro creucial: onde o user_id é igual ao do usuário logado
        .order('created_at', {ascending: false}); //Ordena pelos mais recentes

    //Tratamento de erro na busca
    if(error){
        console.log("Erro ao buscar pedidos:", error);
        return <p className="text-center text-red-500">Ocorreu um erro ao buscar seus pedidos.</p>;
    }

    return(
        <div>
            {/* 2. Adicione o componente aqui. Ele não afeta o layout. */}
            <ClearCartOnSuccess />
            
            <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
            {orders.length === 0 ? (
                <p>Você ainda não fez nenhum pedido.</p>
            ) : (
                <div className="space-y-4">
                    {/* 3.Exibir a lista de pedidos */}
                    {orders.map((order: Order) =>(
                        <div key={order.id} className="bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">Pedido #{order.id}</p>
                                    <p className="text-sm text-gray-400">
                                        Realizado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        {new Intl.NumberFormat('pt-BR', {
                                            style:'currency',
                                            currency: 'BRL',
                                        }).format(order.amount / 100)}{/*Lembre-se que o valor está em centavos*/}
                                    </p>
                                    <p className="text-sm capitalize text-green-400">{order.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}