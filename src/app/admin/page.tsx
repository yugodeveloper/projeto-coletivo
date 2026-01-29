import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. Verifica login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 2. Busca Pedidos (Ajustado para o banco atual)
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      campaigns (
        title,
        image_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Erro no admin:", error)
    return <div className="p-8 text-red-600">Erro ao carregar pedidos.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Meus Pedidos 📦</h1>
            <p className="text-gray-500 mt-1">Gerencie suas participações nas compras coletivas.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
            Você tem <span className="text-green-600 font-bold">{orders?.length || 0}</span> pedidos
          </div>
        </header>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {orders?.map((order: any) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
              
              {/* Ícone */}
              <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                <span>🛒</span>
              </div>

              {/* Info Principal */}
              <div className="flex-grow text-center md:text-left">
                <h3 className="font-bold text-lg text-gray-900">
                  {order.campaigns?.title || 'Produto não encontrado'}
                </h3>
                <div className="text-sm text-gray-500 mt-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span>📅 {new Date(order.created_at).toLocaleDateString()}</span>
                  <span className="hidden md:inline">•</span>
                  <span>Quantidade: {order.quantity} un</span>
                </div>
              </div>

              {/* Status e Preço */}
              <div className="flex flex-col items-center md:items-end min-w-[140px] gap-2">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${order.status === 'pago' ? 'bg-green-100 text-green-800' : ''}
                `}>
                  {order.status}
                </span>
                
                <span className="text-xl font-bold text-gray-900">
                  R$ {order.total_price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Estado Vazio */}
          {(!orders || orders.length === 0) && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Nenhum pedido ainda</h3>
              <p className="text-gray-500 mb-6">Seu histórico aparecerá aqui.</p>
              <Link href="/" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full">
                Começar a Comprar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}