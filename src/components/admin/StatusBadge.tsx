"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function StatusBadge({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    if (loading) return;

    // Se já está pago, não fazemos nada (ou poderíamos desfazer)
    if (currentStatus === 'paid') return;

    const confirm = window.confirm("Confirmar que recebeu o pagamento deste pedido?");
    if (!confirm) return;

    setLoading(true);

    try {
      // Atualiza no Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (error) throw error;

      // Recarrega a página para atualizar a tabela
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status");
    } finally {
      setLoading(false);
    }
  };

  const isPending = currentStatus === 'pending';
  const isPaid = currentStatus === 'paid';

  return (
    <button
      onClick={handleToggleStatus}
      disabled={loading || isPaid}
      className={`
        px-3 py-1 rounded-full text-xs font-bold border transition-all
        ${loading ? "opacity-50 cursor-wait" : "cursor-pointer"}
        ${isPaid 
            ? "bg-green-100 text-green-800 border-green-200 cursor-default" 
            : "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
        }
      `}
      title={isPending ? "Clique para confirmar pagamento" : "Pago"}
    >
      {loading ? "..." : (isPaid ? "Pago ✅" : "Pendente ⏳")}
    </button>
  );
}