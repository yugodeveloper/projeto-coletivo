'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function joinCampaign(campaignId: string, price: number) {
  console.log("--- INICIANDO COMPRA ---")
  
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase.from('orders').insert({
    user_id: user.id,
    campaign_id: campaignId,
    quantity: 1,
    total_price: price,
    status: 'pendente'
  })

  if (error) {
    console.error("❌ ERRO CRÍTICO NO SUPABASE:", error)
    // CORREÇÃO: Lançar o erro em vez de retornar objeto
    throw new Error(`Erro ao criar pedido: ${error.message}`)
  }

  console.log("✅ SUCESSO! Pedido criado.")

  revalidatePath('/')
  redirect('/admin?success=true')
}