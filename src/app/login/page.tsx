'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase' // Use existing configured client
import { LayoutLock, Mail, X } from 'lucide-react' // Added X for close button
import Link from 'next/link'
import { toast } from 'sonner' // Added toast for better feedback

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSent, setIsSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
        // Conexão Real com Supabase
        const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { 
            emailRedirectTo: `${window.location.origin}/capsula/dashboard`,
            shouldCreateUser: true // Ensure user creation if needed
        }
        })

        if (error) throw error
        
        setIsSent(true)
        setMessage("Verifique seu e-mail para acessar o link mágico!")
        toast.success("Link enviado com sucesso!")
    } catch (error: any) {
        setMessage("Erro: " + (error.message || "Falha ao enviar link"))
        toast.error("Erro ao enviar link")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black flex items-center justify-center p-6 relative">
      {/* Botão de Fechar */}
      <Link href="/" className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
        <X className="w-6 h-6" />
      </Link>

      <div className="w-full max-w-[450px] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-amber-500/5 blur-3xl -z-10" />

        <div className="text-center mb-10">
          <div className="bg-amber-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <LayoutLock className="text-amber-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Área Segura</h1>
          <p className="text-zinc-500 mt-2 text-sm font-medium">Sua jornada de evolução continua aqui.</p>
        </div>

        {!isSent ? (
            <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 ml-4 mb-2 block font-bold group-focus-within:text-amber-500 transition-colors">E-mail Profissional</label>
                <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium"
                />
                </div>
            </div>

            <button 
                disabled={loading}
                className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Enviando...' : 'Enviar Link Mágico'}
            </button>
            </form>
        ) : (
            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-20" />
                    <Mail className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Verifique seu E-mail</h3>
                <p className="text-sm text-zinc-400 mb-8 px-4 font-medium leading-relaxed">
                    Enviamos um link de acesso seguro para <br/> <span className="text-amber-500 font-bold">{email}</span>
                </p>
                <button
                    onClick={() => setIsSent(false)}
                    className="text-amber-500 font-black text-[10px] uppercase tracking-widest hover:text-amber-400 transition-colors"
                >
                    ← Tentar outro e-mail
                </button>
            </div>
        )}

        {message && !isSent && (
          <p className="mt-6 text-center text-xs font-medium text-amber-200 bg-amber-500/10 py-3 rounded-xl border border-amber-500/20 italic animate-in fade-in slide-in-from-top-2">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
