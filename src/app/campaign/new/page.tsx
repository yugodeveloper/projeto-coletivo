import { createClient } from '@/lib/supabase/server'
import { createCampaign } from '../actions'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function NewCampaignPage() {
  const supabase = await createClient()
  
  // 1. Segurança: Só logado entra
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Busca produtos disponíveis para revenda (Catálogo)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .gt('end_date', new Date().toISOString()) // Apenas produtos válidos

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Comece uma Campanha 🚀
        </h1>
        <p className="text-gray-500">
          Escolha um produto, defina um nome para seu grupo e comece a divulgar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products?.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Foto do Produto */}
            <div className="h-48 bg-gray-100 relative">
              {product.image_url ? (
                <Image 
                  src={product.image_url} 
                  alt={product.title} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl">📦</div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-green-700">
                Base: R$ {product.price.toFixed(2)}
              </div>
            </div>

            {/* Formulário de Criação */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{product.description}</p>

              <form action={createCampaign} className="space-y-4 mt-auto">
                <input type="hidden" name="product_id" value={product.id} />
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nome da Campanha</label>
                  <input 
                    type="text" 
                    name="title" 
                    required
                    placeholder="Ex: Café do Condomínio X"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Descrição para o Grupo</label>
                  <textarea 
                    name="description" 
                    rows={2}
                    placeholder="Pessoal, vamos comprar juntos para pegar o desconto..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Duração</label>
                  <select 
  name="days" 
  className="..."
>
  <option value="3">3 dias (Rápida)</option>
  <option value="7" selected>7 dias (Padrão)</option> {/* <--- O ERRO TÁ AQUI */}
  <option value="15">15 dias (Longa)</option>
</select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md active:scale-95"
                >
                  Criar Campanha ✨
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}