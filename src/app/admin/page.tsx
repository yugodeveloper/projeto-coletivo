import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/types';
import StatusBadge from '@/components/admin/StatusBadge';

export const dynamic = 'force-dynamic'; // Sempre dados frescos

export default async function AdminPage() {
  // Busca Pedidos + Itens + Variação + Nome do Produto
  // Ordenado do mais recente para o mais antigo
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        unit_price,
        variant:product_variants (
          name,
          product:products (
            name
          )
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Erro ao carregar pedidos: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel do Organizador</h1>
            <p className="text-gray-500">Gerencie os pedidos da rodada.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded shadow text-sm">
            Total Pedidos: <strong>{orders?.length || 0}</strong>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">WhatsApp</th>
                <th className="p-4 font-medium">Pedido (Itens)</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders?.map((order: any) => ( // Usando any temporário aqui só no map pra evitar conflito de tipagem profunda aninhada
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()} <br/>
                    {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {order.customer_phone}
                  </td>
                  <td className="p-4 text-sm">
                    <ul className="space-y-1">
                      {order.order_items?.map((item: any, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{item.quantity}x</span>
                          <span className="text-gray-600">
                            {item.variant?.product?.name} ({item.variant?.name})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 font-bold text-green-700">
                    R$ {order.total_amount}
                  </td>
                  <td className="p-4">
  <StatusBadge 
    orderId={order.id} 
    currentStatus={order.status} 
  />
</td>
                </tr>
              ))}
              
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Nenhum pedido encontrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}