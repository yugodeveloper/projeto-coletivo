'use client'

import Link from 'next/link'
import { signout } from '@/app/auth/actions'
import { useState } from 'react'

// Agora aceitamos user E profile
export function Header({ user, profile }: { user: any, profile: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Tenta pegar o nome do perfil, se não tiver, pega do login, se não, usa 'Usuário'
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'
  const initial = displayName[0].toUpperCase()

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-green-600 text-white p-1.5 rounded-lg font-bold text-lg group-hover:bg-green-700 transition-colors">
            PC
          </div>
          <span className="font-bold text-xl text-gray-800 tracking-tight">
            Projeto<span className="text-green-600">Coletivo</span>
          </span>
        </Link>

        {/* Menu da Direita */}
        <div className="flex items-center gap-6">
          
          {/* Link Carrinho */}
          <Link href="/checkout" className="relative text-gray-500 hover:text-green-600 transition-colors">
            <span className="sr-only">Carrinho</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>

          {user ? (
            // LOGADO
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 py-1 px-2 rounded-full border border-transparent hover:border-gray-200 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 font-medium">Olá,</p>
                  <p className="text-sm font-bold text-gray-800 leading-none">{displayName.split(' ')[0]}</p>
                </div>
                <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                  {initial}
                </div>
              </button>

              {/* Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Conta</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                      📦 Meus Pedidos
                    </Link>
                  </div>

                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button 
                      onClick={() => signout()}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // NÃO LOGADO
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-green-700">
                Entrar
              </Link>
              <Link href="/login" className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-all shadow-sm hover:shadow-md">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}