import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { joinCampaign } from '../actions'
import ShareButton from '@/components/share-button'
import { Metadata, ResolvingMetadata } from 'next'

// Função auxiliar para buscar os dados (evita duplicar código)
async function getCampaign(id: string) {
  const supabase = await createClient()
  const { data: campaign } = await supabase
    .from('campaigns')
    .select(`
      *,
      products (
        image_url,
        min_quantity
      )
    `)
    .eq('id', id)
    .single()
  
  return campaign
}

// 1. A MÁGICA DO CARD (SEO) ✨
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const campaign = await getCampaign(id)

  if (!campaign) {
    return { title: 'Campanha não encontrada' }
  }

  const product = campaign.products as any
  const imageUrl = product?.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e' // Fallback

  return {
    title: campaign.title,
    description: `Compre junto comigo por R$ ${campaign.price.toFixed(2)}. ${campaign.description}`,
    openGraph: {
      title: campaign.title,
      description: `Participe do grupo de compra coletiva! Preço: R$ ${campaign.price.toFixed(2)}`,
      images: [imageUrl], // A foto que vai aparecer no WhatsApp
    },
  }
}

// 2. O Componente da Página (Visual)
export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await getCampaign(id)

  if (!campaign) {
    notFound()
  }

  const product = campaign.products as any
  const imageUrl = product?.image_url
  const minQty = product?.min_quantity || 10
  const endDate = new Date(campaign.expires_at)
  const now = new Date()
  const daysLeft = Math.ceil(Math.abs(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const joinAction = joinCampaign.bind(null, campaign.id, campaign.price)

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-green-700 transition-colors">Home</Link> 
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{campaign.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Imagem */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-fit">
           <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 overflow-hidden relative">
             {imageUrl ? (
               <Image 
                 src={imageUrl} 
                 alt={campaign.title} 
                 fill
                 className="object-cover rounded-xl"
                 sizes="(max-width: 768px) 100vw, 50vw"
                 priority 
               />
             ) : (
               <span className="text-6xl">📦</span>
             )}
           </div>
        </div>

        <div className="space-y-8">
          <div>
            <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Em andamento
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              {campaign.title}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              {campaign.description}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Preço exclusivo do grupo:</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold text-green-700 tracking-tight">
                R$ {campaign.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
              <span>🔥</span> Preço de Atacado
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700">Meta: {minQty} unidades</span>
              <span className="text-green-700 font-bold">5 vendidos</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <p className="text-xs text-gray-400 text-right">Encerra em {daysLeft} dias</p>
          </div>

          <div className="space-y-3">
            <form action={joinAction}>
              <button 
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Participar da Compra 🛒
              </button>
            </form>

            {/* Componente de compartilhar atualizado */}
            <ShareButton title={campaign.title} price={campaign.price} />
          </div>
          
        </div>
      </div>
    </div>
  )
}