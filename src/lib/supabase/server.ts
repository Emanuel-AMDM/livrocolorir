// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Adicionamos um try...catch aqui
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Acontece quando tentamos setar um cookie em um Server Component.
            // Isso pode ser ignorado, pois o middleware/próxima navegação
            // deve atualizar a sessão do usuário.
          }
        },
        // E adicionamos um try...catch aqui também
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Acontece quando tentamos remover um cookie em um Server Component.
            // Isso pode ser ignorado.
          }
        },
      },
    }
  );
}