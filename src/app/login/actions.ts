// src/app/login/actions.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Interface para o estado do nosso formulário
interface ActionResult {
  error?: string;
  success?: string;
}

export async function login(prevState: any, formData: FormData): Promise<ActionResult> {
  const supabase = createSupabaseServerClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Erro no login:', error.message)
    return { error: 'Credenciais inválidas. Tente novamente.' }
  }

  // O redirect só acontece no sucesso total
  redirect('/')
}

export async function signup(prevState: any, formData: FormData): Promise<ActionResult> {
  const supabase = createSupabaseServerClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Checa se o usuário já existe
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', data.email).single();
  if (existingUser) {
    return { error: 'Este e-mail já está em uso.' };
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Erro no cadastro:', error.message)
    return { error: 'Não foi possível criar a conta.' }
  }
  
  return { success: 'Conta criada! Por favor, cheque seu e-mail para confirmar.' }
}

export async function logout(){
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/login');
}