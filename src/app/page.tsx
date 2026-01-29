import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  
  // Busca campanhas ativas
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 pb-20">
      
      {/* Hero Section (Banner) */}
      <section className="bg-green-700 text-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Compre junto, <br/> economize muito.
          </h1>
          <p className="text-green-100 text-lg mb-8 opacity-90">
            Junte-se aos seus vizinhos para desbloquear preços de atacado direto do produtor. Sem intermediários.
          </p>
          <a href="#ofertas" className="inline-block bg-white text-green-800 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-colors shadow-lg">
            Ver Ofertas Ativas
          </a>
        </div>
        
        {/* Elemento Decorativo (Bolinhas) */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
      </section>

      {/* Grid de Ofertas */}
      <section id="ofertas">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Ofertas da Semana</h2>
          <span className="text-sm text-gray-500">{campaigns?.length || 0} campanhas ativas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              
              {/* --- Lógica de Imagem Real --- */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {campaign.image_url ? (
                  // Se tiver URL, mostra a imagem real
                  <img 
                    src={campaign.image_url} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // Se não tiver, mostra o placeholder (ícone)
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-4xl">☕</span>
                  </div>
                )}
                
                {/* Badge de Data */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                  Ativo até {new Date(campaign.end_date).toLocaleDateString()}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{campaign.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{campaign.description}</p>
                
                {/* Preço */}
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-2xl font-bold text-green-700">R$ {campaign.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-400 mb-1">/unidade</span>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                    <span>Meta do grupo</span>
                    <span>5 / {campaign.min_quantity} un</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                {/* Botão */}
                <Link 
                  href={`/campaign/${campaign.id}`}
                  className="block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Participar
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Estado Vazio (O erro estava aqui embaixo) */}
        {(!campaigns || campaigns.length === 0) && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">Nenhuma campanha ativa no momento.</p>
          </div>
        )}
      </section>
    </div>
  )
}