'use client'

import { useEffect, useState } from 'react'

export default function ShareButton({ title, price }: { title: string, price: number }) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const message = `Olá! 👋\n\nCriei um grupo pra gente comprar *${title}* direto do produtor por *R$ ${price.toFixed(2)}*.\n\nPrecisamos juntar a galera pra pegar esse preço. Bora participar?\n\nClica aqui: ${currentUrl}`

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    
    // Volta o texto ao normal depois de 2 segundos
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
      {/* Botão Principal: WhatsApp */}
      <button 
        onClick={handleWhatsApp}
        className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-green-200"
      >
        <span>📲</span> Enviar no WhatsApp
      </button>

      {/* Botão Secundário: Copiar */}
      <button 
        onClick={handleCopy}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-4 rounded-xl transition-colors border border-gray-200 min-w-[140px]"
      >
        {copied ? 'Copiado! ✅' : 'Copiar 📋'}
      </button>
    </div>
  )
}