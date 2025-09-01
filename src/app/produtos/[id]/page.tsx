//src/app/products/[id]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

//A pagina recebe 'params' que contem os segmentos dinamicos da URL
export default async function ProdutoPage({params}: {params: {id:string}}) {
    const {id} = params;

    //Cliente anonimo para buscar dados publicos do produto
    const supabaseAnon = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    //Buscar um unico produto usando o 'id' da URL
    const {data: product, error} = await supabaseAnon
        .from('products')
        .select('*')
        .eq('id', id)
        .single(); //.single() espera um unico resultado e retorna um objeto, não um array

    //Se o produto não for encontrado, exibe a pagina 404 do Next.js
    if(!product){
        notFound();
    }

    //Cliente de servidor para buscar o usuario logado (para passar ao BuyButton)
    const supabaseServer = createSupabaseServerClient();
    const {data: {user}} = await supabaseServer.auth.getUser();

    return(
        <div className='container mx-auto p-4'>
            <div className='bg-gray-800 p-8 rounded-lg shadow-lg'>
                <h1 className='text-4xl font-bold mb-4'>{product.name}</h1>
                <p className='text-gray-400 mb-6'>{product.description}</p>
                <div className='flex items-center justify-between'>
                    <p className='text-3xl font-bold text-green-400'>
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(product.price)}
                    </p>
                    <AddToCartButton product={product}/>
                </div>
            </div>
        </div>
    );
}