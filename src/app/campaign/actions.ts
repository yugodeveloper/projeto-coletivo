'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- Ação de COMPRA (Já existia) ---
export async function joinCampaign(campaignId: string, price: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase.from('orders').insert({
    user_id: user.id,
    campaign_id: campaignId,
    quantity: 1,
    total_price: price,
    status: 'pendente'
  })

  if (error) throw new Error(`Erro ao criar pedido: ${error.message}`)

  revalidatePath('/')
  redirect('/admin?success=true')
}

// --- NOVA AÇÃO: CRIAÇÃO DE CAMPANHA ---
export async function createCampaign(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const productId = formData.get('product_id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const days = parseInt(formData.get('days') as string)

  // 1. Busca o produto original para pegar o preço base
  const { data: product } = await supabase
    .from('products')
    .select('price, min_quantity')
    .eq('id', productId)
    .single()

  if (!product) throw new Error("Produto não encontrado")

  // 2. Calcula a data de expiração
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + days)

  // 3. Cria a campanha
  const { error } = await supabase.from('campaigns').insert({
    promoter_id: user.id,
    product_id: productId,
    title: title,
    description: description,
    price: product.price, // Usa o preço base do produto
    target_quantity: product.min_quantity, // Usa a meta base do produto
    expires_at: expiresAt.toISOString(),
    status: 'active'
  })

  if (error) {
    console.error(error)
    throw new Error("Erro ao criar campanha")
  }

  revalidatePath('/')
  redirect('/') // Volta para a home para ver a campanha criada
}