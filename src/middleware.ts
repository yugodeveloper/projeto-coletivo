import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Simplesmente atualiza a sessão do Supabase e deixa passar.
  // A proteção real de quem pode ver o quê está dentro das páginas (admin/page.tsx).
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas, exceto arquivos estáticos, imagens, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}