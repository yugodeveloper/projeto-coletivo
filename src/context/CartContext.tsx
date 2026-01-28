"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type CartItem = {
  variantId: string;
  productId: string;
  campaignId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 1. Carregar do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('cart-coletivo');
      if (saved) {
        try {
          const parsedItems = JSON.parse(saved);
          
          // O comentário abaixo diz pro VS Code ignorar o alerta nesta linha específica
          // eslint-disable-next-line
          setItems(parsedItems);
          
        } catch (error) {
          console.error("Erro ao ler carrinho do cache:", error);
          localStorage.removeItem('cart-coletivo');
        }
      }
    }
  }, []);

  // 2. Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Pequena proteção para não salvar lista vazia em cima da lista cheia durante o carregamento
      // Só salvamos se o items tiver algo OU se já passamos do carregamento inicial
      if (items.length > 0) {
        localStorage.setItem('cart-coletivo', JSON.stringify(items));
      }
    }
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.variantId === newItem.variantId);
      if (existingItem) {
        return currentItems.map((item) =>
          item.variantId === newItem.variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (variantId: string) => {
    setItems((currentItems) => {
      return currentItems.reduce((acc, item) => {
        if (item.variantId === variantId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem('cart-coletivo');
    }
  };

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
}