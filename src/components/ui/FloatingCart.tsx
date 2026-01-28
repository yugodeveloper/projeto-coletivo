"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link"; // Importar Link

export default function FloatingCart() {
  const { cartCount, cartTotal } = useCart();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total estimado</p>
          <p className="text-xl font-bold text-gray-900">
            R$ {cartTotal.toFixed(2)}
          </p>
          <p className="text-xs text-blue-600">{cartCount} itens</p>
        </div>
        
        {/* Envolvemos o botão com o Link */}
        <Link href="/checkout"> 
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Fechar Pedido
          </button>
        </Link>

      </div>
    </div>
  );
}