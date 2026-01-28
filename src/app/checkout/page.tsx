"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Se o carrinho estiver vazio, mostra mensagem
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio 🛒</h2>
        <Link href="/" className="text-blue-600 underline">Voltar para campanhas</Link>
      </div>
    );
  }

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Validar dados básicos
      if (!name || !phone) {
        alert("Por favor, preencha nome e telefone.");
        setLoading(false);
        return;
      }

      // 2. Criar o Pedido (Order) na tabela 'orders'
      const campaignId = items[0].campaignId;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          campaign_id: campaignId,
          customer_name: name,
          customer_phone: phone,
          total_amount: cartTotal,
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Criar os Itens do Pedido na tabela 'order_items'
      const orderItemsData = items.map((item) => ({
        order_id: order.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      // 4. Sucesso! Limpar carrinho e redirecionar
      clearCart();
      alert("Pedido realizado com sucesso! 🎉");
      router.push("/"); 

    } catch (error: unknown) { // <--- AQUI MUDOU: De 'any' para 'unknown'
      console.error("Erro ao fechar pedido:", error);
      alert("Erro ao salvar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Finalizar Compra</h1>

        {/* Resumo do Pedido */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-3">Resumo</h3>
          <ul className="space-y-2 mb-4">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleFinishOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome (como o porteiro conhece)</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: João Silva - Apto 302"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input 
              type="tel" 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-all mt-6 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Confirmar Pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}