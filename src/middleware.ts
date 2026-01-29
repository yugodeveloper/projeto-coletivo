import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Configurar Supabase para renovar Cookies automaticamente
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Atualiza sessão
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 2. Proteção do Admin (Sua lógica antiga de Basic Auth)
  if (path.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      try {
        const [u, p] = atob(authHeader.split(' ')[1]).split(':')
        if (u === 'admin' && p === 'cafe123') {
          return supabaseResponse
        }
      } catch {}
    }
    return new NextResponse('Auth Required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    })
  }

  // 3. Proteção de Rotas de Usuário (Novo!)
  // Se tentar ir pro Checkout sem estar logado -> Manda pro Login
  if (path.startsWith('/checkout') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  // Roda em tudo, exceto arquivos estáticos e imagens
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}