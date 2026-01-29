'use client'

import { useState } from 'react'
import { login, signup } from '@/app/auth/actions'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função "Capa" para lidar com o envio e erros
  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    const action = isLogin ? login : signup
    const result = await action(formData)
    
    // Se a action retornou algo, foi erro (pq o sucesso faz redirect)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Entre para gerenciar suas compras.' : 'Junte-se à comunidade de compras coletivas.'}
          </p>
        </div>

        {/* Abas */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => { setIsLogin(true); setError(null) }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              isLogin ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null) }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              !isLogin ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Formulário */}
        <form action={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input name="fullName" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input name="whatsapp" type="tel" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="(00) 00000-0000" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input name="email" type="email" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="seu@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input name="password" type="password" required minLength={6} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="******" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            ← Voltar para a loja
          </Link>
        </div>

      </div>
    </div>
  )
}