import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { joinCampaign } from '../actions'

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. O await obrigatório para o Next.js novo
  const { id } = await params
  
  const supabase = await createClient()
  
  // 2. Busca os dados (incluindo a image_url)
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !campaign) {
    notFound()
  }

  const endDate = new Date(campaign.end_date)
  const now = new Date()
  const daysLeft = Math.ceil(Math.abs(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const joinAction = joinCampaign.bind(null, campaign.id, campaign.price)

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-green-700 transition-colors">Home</Link> 
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{campaign.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* --- MUDANÇA AQUI: Imagem Grande --- */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-fit">
           <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 overflow-hidden relative">
             {campaign.image_url ? (
               // Se tiver imagem, mostra ela ocupando tudo
               <img 
                 src={campaign.image_url} 
                 alt={campaign.title} 
                 className="w-full h-full object-cover"
               />
             ) : (
               // Senão, mostra o emoji
               <span className="text-6xl">📦</span>
             )}
           </div>
        </div>
        {/* ----------------------------------- */}

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
              <span className="text-lg text-gray-400 line-through">
                R$ {(campaign.price * 1.3).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
              <span>🔥</span> Economia de 30% garantida
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700">Meta: {campaign.min_quantity} unidades</span>
              <span className="text-green-700 font-bold">5 vendidos</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <p className="text-xs text-gray-400 text-right">Encerra em {daysLeft} dias</p>
          </div>

          <form action={joinAction}>
            <button 
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Participar da Compra 🛒
            </button>
          </form>
          
        </div>
      </div>
    </div>
  )
}