import Link from 'next/link'
import Image from 'next/image' // <--- Importante!
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select(`
      *,
      products (
        image_url,
        min_quantity
      )
    `)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 pb-20">
      
      {/* Hero Section */}
      <section className="bg-green-700 text-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Compre junto, <br/> economize muito.
          </h1>
          <p className="text-green-100 text-lg mb-8 opacity-90">
            Ofertas ativas da sua comunidade. Preço de atacado, direto do produtor.
          </p>
          <a href="#ofertas" className="inline-block bg-white text-green-800 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-colors shadow-lg">
            Ver Ofertas
          </a>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* Grid de Ofertas */}
      <section id="ofertas">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Ofertas Ativas</h2>
          <span className="text-sm text-gray-500">{campaigns?.length || 0} ativas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => {
             const product = campaign.products as any;
             const imageUrl = product?.image_url;
             const minQty = product?.min_quantity || 10;

             return (
              <div key={campaign.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                
                {/* Imagem Otimizada com Next/Image */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={campaign.title} 
                      fill // Preenche o container pai (h-48)
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400"><span className="text-4xl">☕</span></div>
                  )}
                  
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm z-10">
                    Até {new Date(campaign.expires_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{campaign.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{campaign.description}</p>
                  
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-2xl font-bold text-green-700">R$ {campaign.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 mb-1">/unidade</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                      <span>Meta</span>
                      <span>5 / {minQty} un</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  <Link href={`/campaign/${campaign.id}`} className="block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors">
                    Participar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}