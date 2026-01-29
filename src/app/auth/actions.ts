'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // BLINDAGEM: Removemos espaços extras com .trim()
  const email = String(formData.get('email')).trim()
  const password = String(formData.get('password')).trim()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log("Login Erro:", error.message)
    return { error: 'Email ou senha inválidos' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // BLINDAGEM AQUI TAMBÉM
  const email = String(formData.get('email')).trim()
  const password = String(formData.get('password')).trim()
  const fullName = String(formData.get('fullName')).trim()
  const whatsapp = String(formData.get('whatsapp')).trim()

  // 1. Cria o usuário
  const { data, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        whatsapp: whatsapp,
        cpf: '' 
      }
    }
  })

  if (signupError) {
    console.error("Erro no cadastro:", signupError)
    return { error: signupError.message } // Vai mostrar na tela se for invalido
  }

  // 2. Se já veio logado (Sessão existe), sucesso!
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  // 3. Se não veio sessão, tenta logar manualmente
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    console.error("Erro no auto-login:", loginError)
    // Se falhar aqui, redireciona para login para tentar de novo
    redirect('/login?message=Conta criada. Faça login.')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}