'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function joinCampaign(campaignId: string, price: number) {
  const supabase = await createClient()

  // 1. Verifica quem é o usuário
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Se não estiver logado, manda pro login com uma mensagem
    redirect('/login?message=Faça login para participar da compra')
  }

  // 2. Cria o pedido na tabela 'orders'
  const { error } = await supabase.from('orders').insert({
    user_id: user.id,
    campaign_id: campaignId,
    quantity: 1, // Por enquanto fixo em 1 unidade
    total_price: price,
    status: 'pendente'
  })

  if (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao processar pedido.' }
  }

  // 3. Sucesso! Redireciona para uma página de "Meus Pedidos" (vamos criar já já)
  // Por enquanto, vamos mandar de volta pra home com um aviso visual
  revalidatePath('/')
  redirect('/admin?success=true') 
}