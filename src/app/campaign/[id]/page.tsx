import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/campaign/AddToCartButton';
import FloatingCart from '@/components/ui/FloatingCart';
import { Product, ProductVariant } from '@/types';

export const dynamic = 'force-dynamic';

// ATENÇÃO: Mudança para Next.js 15
// params agora é definido como uma Promise
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignPage(props: PageProps) {
  // 1. AWAIT: Extraímos o ID da Promise antes de usar
  const params = await props.params;
  const { id } = params;

  // 2. Buscar dados da Campanha usando o 'id' já processado
  const { data: campaign } = await supabase
    .from('campaigns')
    .select(`*, store:stores(*)`)
    .eq('id', id) // <--- Aqui usamos a variável 'id' limpa
    .single();

  if (!campaign) return notFound();

  // 3. Buscar Produtos
  const { data: products } = await supabase
    .from('products')
    .select(`*, variants:product_variants(*)`)
    .eq('store_id', campaign.store_id);

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* Cabeçalho */}
      <div className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
            Organizado por {campaign.store?.name}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{campaign.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
              Status: {campaign.status}
            </span>
            <span>Encerra em: {new Date(campaign.ends_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <main className="max-w-3xl mx-auto py-10 px-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Escolha seus cafés</h2>
        
        <div className="space-y-6">
          {products?.map((product: Product) => (
            <div key={product.id} className="flex gap-4 border-b border-gray-100 pb-6">
              
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                <Image 
                  src={product.image_url} 
                  alt={product.name} 
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{product.description}</p>

                <div className="space-y-2">
                  {product.variants?.map((variant: ProductVariant) => (
                    <div key={variant.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-500 transition-colors group">
                      <div>
                        <span className="font-medium text-gray-700">{variant.name}</span>
                        <span className="text-xs text-gray-400 block">
                           {variant.weight_g}g
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">
                          R$ {variant.price}
                        </span>
                        
                       <AddToCartButton 
  campaignId={campaign.id} // <--- ADICIONE ESTA LINHA
  variantId={variant.id}
  productId={product.id}
  name={`${product.name} - ${variant.name}`}
  price={variant.price}
/>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <FloatingCart />
    </div>
  );
}