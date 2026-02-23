'use client'

import { useState } from 'react'
import {
    Settings,
    Bell,
    Lock,
    CreditCard,
    Globe,
    Palette,
    Save,
    CheckCircle2,
    Calendar,
    Sparkles,
    Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('plataforma')
    const [isSaving, setIsSaving] = useState(false)

    const tabs = [
        { id: 'plataforma', label: 'Plataforma', icon: Settings },
        { id: 'visual', label: 'Identidade Visual', icon: Palette },
        { id: 'notificacoes', label: 'Notificações', icon: Bell },
        { id: 'seguranca', label: 'Segurança', icon: Lock },
        { id: 'checkout', label: 'Pagamentos & Checkout', icon: CreditCard },
    ]

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    return (
        <div className="space-y-12 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-neural-authority tracking-tight">
                        Configurações <span className="text-neural-conversion underline decoration-neural-authority/10">Avançadas</span>
                    </h1>
                    <p className="text-gray-400 font-medium mt-2 text-lg">
                        Personalize cada detalhe da sua experiência premium e controle total do sistema.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                        "flex items-center gap-2 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl",
                        isSaving
                            ? "bg-green-500 text-white shadow-green-500/20 animate-pulse"
                            : "bg-neural-authority text-white shadow-neural-authority/20 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                >
                    {isSaving ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Salvo!' : 'Salvar Alterações'}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Tabs Sidebar */}
                <div className="xl:col-span-1 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm text-left group",
                                    isActive
                                        ? "bg-white text-neural-authority shadow-md shadow-gray-200/50"
                                        : "text-gray-400 hover:text-neural-authority hover:bg-gray-50"
                                )}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform",
                                    isActive ? "text-neural-conversion" : "group-hover:scale-110"
                                )} />
                                {tab.label}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neural-conversion" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-10">
                        {activeTab === 'plataforma' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-black text-neural-authority flex items-center gap-3">
                                        <Globe className="w-6 h-6 text-neural-conversion" /> Geral da Plataforma
                                    </h2>
                                    <p className="text-gray-400 text-sm font-medium mt-1">Configurações básicas de nomes e domínios.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Nome da Plataforma</label>
                                        <input
                                            type="text"
                                            defaultValue="Agendamento Premium SaaS"
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-neural-authority focus:bg-white focus:border-neural-authority/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email de Suporte</label>
                                        <input
                                            type="email"
                                            defaultValue="suporte@capsula.com"
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-neural-authority focus:bg-white focus:border-neural-authority/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-neural-authority/5 border border-neural-authority/10 rounded-3xl group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-neural-authority shadow-sm group-hover:scale-110 transition-transform">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black text-neural-authority">Agendamento Automático</h4>
                                            <p className="text-sm text-gray-500 font-medium">Permitir que usuários agendem sem aprovação manual do administrador.</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer mt-2">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neural-authority"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'visual' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-black text-neural-authority flex items-center gap-3">
                                        <Palette className="w-6 h-6 text-neural-conversion" /> Estilo Premium
                                    </h2>
                                    <p className="text-gray-400 text-sm font-medium mt-1">Sua marca, suas cores, sua autoridade.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 border border-gray-100 rounded-3xl space-y-4">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tom de Autoridade</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-neural-authority rounded-2xl shadow-lg" />
                                            <code className="text-xs font-bold text-neural-authority">#012340</code>
                                            <button className="ml-auto text-xs font-black text-neural-conversion uppercase hover:underline tracking-widest">Alterar</button>
                                        </div>
                                    </div>
                                    <div className="p-6 border border-gray-100 rounded-3xl space-y-4">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tom de Conversão</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-neural-conversion rounded-2xl shadow-lg" />
                                            <code className="text-xs font-bold text-neural-authority">#D4AF37</code>
                                            <button className="ml-auto text-xs font-black text-neural-conversion uppercase hover:underline tracking-widest">Alterar</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                        <Sparkles className="w-8 h-8 text-neutral-authority opacity-20" />
                                    </div>
                                    <h4 className="font-black text-neural-authority mb-1">Logo da Plataforma</h4>
                                    <p className="text-xs text-gray-400 font-medium mb-6">Arraste seu logo em formato PNG ou SVG (Máx 5MB)</p>
                                    <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-neural-authority hover:bg-gray-100 transition-all uppercase tracking-widest shadow-sm">
                                        Upload de Arquivo
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'seguranca' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-black text-neural-authority flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-neural-conversion" /> Proteção de Dados
                                    </h2>
                                    <p className="text-gray-400 text-sm font-medium mt-1">Configurações de privacidade e acesso.</p>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full p-6 text-left border border-gray-100 rounded-3xl hover:border-neural-authority/10 hover:bg-[#F8FAFC] transition-all group flex items-center gap-4">
                                        <div className="w-10 h-10 bg-neural-authority/5 text-neural-authority rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base font-black text-neural-authority">Autenticação em Duas Etapas</p>
                                            <p className="text-xs text-gray-400 font-medium">Garanta que apenas você tenha acesso ao painel master.</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300" />
                                    </button>
                                    <button className="w-full p-6 text-left border border-gray-100 rounded-3xl hover:border-neural-authority/10 hover:bg-[#F8FAFC] transition-all group flex items-center gap-4">
                                        <div className="w-10 h-10 bg-neural-authority/5 text-neural-authority rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base font-black text-neural-authority">Logs de Acesso</p>
                                            <p className="text-xs text-gray-400 font-medium">Histórico completo de quem acessou e editou o sistema.</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
