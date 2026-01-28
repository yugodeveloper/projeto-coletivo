import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Verifica se a rota acessada começa com /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    
    // Pega o cabeçalho de autorização que o navegador envia
    const authHeader = req.headers.get('authorization');

    if (authHeader) {
      // O formato vem como "Basic dXN1YXJpbzpzZW5oYQ==" (Base64)
      const authValue = authHeader.split(' ')[1];
      // Decodifica o Base64 para texto normal
      const [user, pwd] = atob(authValue).split(':');

      // Verifica se bate com as variáveis de ambiente
      if (
        user === process.env.ADMIN_USER && 
        pwd === process.env.ADMIN_PASSWORD
      ) {
        // Se bateu, deixa passar!
        return NextResponse.next();
      }
    }

    // Se não tiver cabeçalho ou a senha estiver errada, bloqueia e pede senha
    return new NextResponse('Autenticação Necessária', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Área Restrita do Síndico"',
      },
    });
  }

  // Para qualquer outra rota (/, /campaign, etc), deixa passar livre
  return NextResponse.next();
}

// Configura quais caminhos o middleware vai "vigiar"
export const config = {
  matcher: '/admin/:path*',
};