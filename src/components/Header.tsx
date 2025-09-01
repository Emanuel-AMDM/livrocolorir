// src/components/Header.tsx
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logout } from '@/app/login/actions';
import { LogoutButton } from './LogoutButton';
import CartIcon from './CartIcon'; // 1. Importe o novo componente

export default async function Header() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Links de Navegação */}
        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/sobre" className="hover:text-gray-300">
            Sobre
          </Link>
        </div>

        {/* Lado Direito: Ícone do Carrinho e Status do Usuário */}
        <div className="flex items-center gap-4">
          {/* 2. Adicione o ícone do carrinho aqui */}
          <CartIcon />

          {user ? (
            // Se o usuário estiver logado
            <div className="flex items-center gap-4">
              <Link href="/meus-pedidos" className="text-sm hover:text-gray-300">
                Meus Pedidos
              </Link>
              <span className="text-sm text-gray-400">{user.email}</span>
              <form action={logout}>
                <LogoutButton />
              </form>
            </div>
          ) : (
            // Se o usuário NÃO estiver logado
            <Link 
              href="/login" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}