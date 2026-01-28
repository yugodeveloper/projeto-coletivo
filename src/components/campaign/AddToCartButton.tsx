"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  campaignId: string; // <--- RECEBE O ID
  variantId: string;
  productId: string;
  name: string;
  price: number;
};

export default function AddToCartButton({ campaignId, variantId, productId, name, price }: Props) {
  const { addToCart, items } = useCart();
  
  const currentItem = items.find((item) => item.variantId === variantId);
  const quantity = currentItem?.quantity || 0;

  const handleAdd = () => {
    addToCart({
      campaignId, // <--- ENVIA O ID
      variantId,
      productId,
      name,
      price,
      quantity: 1,
    });
  };

  return (
    <button 
      onClick={handleAdd}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        quantity > 0 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
      } text-white`}
    >
      {quantity > 0 ? quantity : "+"}
    </button>
  );
}