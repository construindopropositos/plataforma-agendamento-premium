'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Rocket, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin + '/dashboard',
                },
            })

            if (error) throw error
            setIsSent(true)
            toast.success('Link enviado!', {
                description: 'Verifique sua caixa de entrada para acessar.'
            })
        } catch (error: any) {
            toast.error('Erro ao entrar', {
                description: error.message || 'Tente novamente.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-neural-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-neural-authority/5 rounded-full blur-3xl -tranaslate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-neural-conversion/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white shadow-sm border border-gray-100 px-4 py-1.5 rounded-full mb-6">
                        <ShieldCheck className="w-4 h-4 text-neural-authority" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neural-authority/60">Acesso Premium Seguro</span>
                    </div>
                    <h1 className="text-3xl font-black text-neural-authority mb-2 tracking-tight">Bem-vindo de <span className="text-neural-conversion">Volta</span></h1>
                    <p className="text-gray-500 text-sm font-medium">Sua jornada de evolução continua aqui.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-neural-authority/5 border border-gray-100 p-8 md:p-10">
                    {!isSent ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neural-authority/40 ml-1">E-mail Profissional</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-neural-authority outline-none transition-all font-medium text-neural-authority"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Entrar com Link Mágico
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-gray-400 font-bold px-4 leading-relaxed">
                                Ao entrar, você concorda com nossos termos de segurança e proteção de dados RLS.
                            </p>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-neural-authority mb-2">Verifique seu E-mail</h3>
                            <p className="text-sm text-gray-500 mb-8 px-4">
                                Enviamos um acesso seguro para **{email}**. <br /> Verifique sua caixa de entrada e spam.
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-neural-authority font-black text-xs uppercase tracking-widest hover:underline"
                            >
                                Tentar outro e-mail
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-gray-400 text-xs font-bold hover:text-neural-authority transition-colors">
                        ← Voltar para a Página Inicial
                    </Link>
                </div>
            </motion.div>
        </main>
    )
}
