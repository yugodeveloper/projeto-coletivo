import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Verifica se a rota acessada começa com /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    
    const authHeader = req.headers.get('authorization');

    if (authHeader) {
      try {
        // Tenta decodificar a senha. Se der erro aqui, ele pula pro catch
        // em vez de quebrar o site inteiro (Erro 500)
        const authValue = authHeader.split(' ')[1];
        if (!authValue) throw new Error("Header inválido");

        const [user, pwd] = atob(authValue).split(':');

        // Verifica as senhas
        if (
          user === process.env.ADMIN_USER && 
          pwd === process.env.ADMIN_PASSWORD
        ) {
          return NextResponse.next();
        }
      } catch (error) {
        // Se a decodificação falhar, apenas ignora e deixa cair no 401 abaixo
        console.error("Erro de autenticação:", error);
      }
    }

    // Bloqueia e pede senha
    return new NextResponse('Autenticação Necessária', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Área Restrita do Síndico"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};