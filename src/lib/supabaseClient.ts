//src/lib/supabaseClient.ts
import { createBrowserClient } from "@supabase/ssr";

//Essa função cria um cliente para o lado do cliente(navegador)
export function createClient(){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createBrowserClient(supabaseUrl, supabaseKey);
}