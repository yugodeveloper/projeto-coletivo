import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. Só roda na rota /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    
    // 2. Verifica se o navegador mandou credenciais
    const authHeader = req.headers.get('authorization');

    if (authHeader) {
      try {
        // Pega a parte codificada "Basic aG9sYT..."
        const token = authHeader.split(' ')[1];
        
        // Decodifica (atob é nativo da web, deve funcionar)
        const decoded = atob(token);
        const [user, pwd] = decoded.split(':');

        // --- TESTE DIRETO (SEM VARIÁVEIS) ---
        // Vamos usar admin / cafe123 direto aqui pra testar
        if (user === 'admin' && pwd === 'cafe123') {
          return NextResponse.next();
        }
      } catch (e) {
        // Se der erro decodificando, ignora e pede senha de novo
      }
    }

    // 3. Se não tiver senha ou estiver errada, bloqueia
    return new NextResponse('Auth Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Area Restrita"',
      },
    });
  }

  // Deixa passar o resto do site
  return NextResponse.next();
}

// Configuração
export const config = {
  matcher: '/admin/:path*',
};