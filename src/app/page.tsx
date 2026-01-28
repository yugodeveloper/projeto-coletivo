import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Campaign } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: campaigns } = await supabase
    .from('campaigns')
    // ADICIONEI 'ends_at' AQUI EMBAIXO 👇
    .select('id, title, goal_amount, status, ends_at, store:stores(name)')
    .eq('status', 'active');

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Compras Coletivas
          </h1>
          <p className="text-gray-600">
            Compre direto do produtor com seus vizinhos.
          </p>
        </header>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Campanhas Abertas</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {campaigns?.map((campaign: Campaign) => (
            <Link 
              href={`/campaign/${campaign.id}`} 
              key={campaign.id}
              className="block group"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all group-hover:shadow-md group-hover:border-blue-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mb-2">
                      {/* O Supabase as vezes retorna array, protegemos aqui */}
                      {Array.isArray(campaign.store) ? campaign.store[0]?.name : campaign.store?.name}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {campaign.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                      <span>Meta da Rodada</span>
                      <span className="font-medium">R$ {campaign.goal_amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">15% atingido</p>
                  </div>

                  {/* Mostrando a data que faltava */}
                  <div className="text-xs text-center text-gray-400 mt-2">
                    Encerra em {new Date(campaign.ends_at).toLocaleDateString()}
                  </div>

                  <div className="w-full py-2 text-center text-blue-600 font-semibold text-sm border border-blue-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                    Ver Produtos &rarr;
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {(!campaigns || campaigns.length === 0) && (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">Nenhuma campanha ativa no momento.</p>
              <p className="text-sm text-gray-400">Peça para o síndico criar uma!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}