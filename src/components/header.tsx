'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

interface HeaderProps {
  user: any
  profile?: any
}

export default function Header({ user, profile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Fecha menu ao navegar para qualquer outra rota
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // Lógica para nome e iniciais
  const fullName = user?.user_metadata?.full_name || profile?.full_name
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  const firstName = fullName?.split(' ')[0] || 'Visitante'

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">PC</span>
          <span>Projeto Coletivo</span>
        </Link>

        {/* Área do Usuário */}
        {user ? (
          <div 
            className="relative h-full flex items-center" 
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              // Abre ao passar o mouse
              onMouseEnter={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {firstName}
              </span>
              <span className="text-gray-400 text-xs">▼</span>
            </button>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div 
                className="absolute right-0 top-full pt-2 w-56 z-50"
                // Mantém aberto se o mouse estiver sobre o menu (Ponte Invisível)
                onMouseEnter={() => setIsMenuOpen(true)}
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Logado como</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                  
                  <div className="p-2">
                    {/* --- NOVO LINK ADICIONADO AQUI 👇 --- */}
                    <Link 
                      href="/campaign/new" 
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors flex items-center gap-2 mb-1"
                    >
                      <span>📢</span> Criar Campanha
                    </Link>

                    <Link 
                      href="/admin" 
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>📦</span> Meus Pedidos
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 mt-1 border-t border-gray-50 pt-2"
                    >
                      <span>🚪</span> Sair da Conta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/login"
            className="text-sm font-bold text-green-700 hover:text-green-800 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}