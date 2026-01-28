// src/types/index.ts

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  weight_g: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  variants?: ProductVariant[]; 
}

export interface Store {
  name: string;
}

export interface Campaign {
  id: string;
  title: string;
  goal_amount: number;
  status: string;
  ends_at: string;
  // AQUI ESTÁ A MÁGICA:
  // Dizemos que pode ser um objeto Store OU (|) uma lista de Stores (Store[])
  store?: Store | Store[]; 
}

// ... mantenha as interfaces Product, Store, Campaign que já existem ...

// Adicione daqui para baixo:

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  // O Supabase vai aninhar os dados do produto aqui
  variant?: {
    name: string;
    product?: {
      name: string;
    }
  }
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}