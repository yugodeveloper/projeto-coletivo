import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image' // Importante para otimização
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. Verifica autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Busca os pedidos do usuário logado
  // MUDANÇA CRÍTICA: O select agora busca campaigns -> products -> image_url
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      quantity,
      total_price,
      status,
      created_at,
      campaigns (
        id,
        title,
        price,
        products (
          image_url
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Erro ao buscar pedidos:", error)
    return <div className="p-8 text-red-500">Erro ao carregar seus pedidos.</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos 📦</h1>
        <Link href="/" className="text-sm text-green-700 hover:underline">
          ← Voltar para a loja
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {orders && orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((order: any) => {
              // Helpers para acessar os dados aninhados com segurança
              const campaign = order.campaigns
              const product = campaign?.products
              // Fallback se a imagem não existir
              const imageUrl = product?.image_url 
              
              return (
                <div key={order.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                  {/* Imagem do Produto */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden border border-gray-200">
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={campaign?.title || 'Produto'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xl">☕</div>
                    )}
                  </div>

                  {/* Detalhes do Pedido */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {campaign?.title || 'Campanha Indisponível'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pedido realizado em {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-700 mt-2">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Quantidade</span>
                        <span className="font-medium">{order.quantity} un</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Total</span>
                        <span className="font-medium text-green-700">R$ {order.total_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">Você ainda não fez nenhum pedido.</p>
            <Link href="/" className="inline-block mt-4 text-green-600 font-bold hover:underline">
              Explorar Ofertas
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}