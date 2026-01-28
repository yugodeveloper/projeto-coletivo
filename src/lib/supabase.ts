import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificação de Segurança
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente do Supabase não encontradas.');
  console.error('Verifique se o arquivo .env.local existe na raiz do projeto.');
  console.error('Valor lido URL:', supabaseUrl);
  console.error('Valor lido KEY:', supabaseAnonKey ? 'Definido (Oculto)' : 'Indefinido');
  
  // Isso evita que o app trave totalmente, mas o banco não vai funcionar
  throw new Error('Supabase Url is missing. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);