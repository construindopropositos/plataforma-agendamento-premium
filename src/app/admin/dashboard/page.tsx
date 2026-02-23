'use client'

import { useState, useEffect } from 'react'
import {
    Users,
    Calendar,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAdminStats } from '@/app/actions/admin'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalClients: 0,
        pendingSessons: 0,
        confirmedSessions: 0,
        revenue: 'R$ 0',
        nextSessions: [] as any[]
    })
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        async function fetchStats() {
            const { data, error } = await getAdminStats()
            if (data) {
                setStats({
                    totalClients: data.uniqueClients,
                    pendingSessons: data.pendingSessions,
                    confirmedSessions: data.confirmedSessions,
                    revenue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalRevenue),
                    nextSessions: data.nextSessions
                })
            }
            setLoading(false)
        }
        fetchStats()
    }, [])

    const cards = [
        { label: 'Clientes Únicos', value: stats.totalClients, icon: Users, color: 'blue', trend: 'Total', sub: 'Base de dados' },
        { label: 'Sessões Pendentes', value: stats.pendingSessons, icon: Clock, color: 'orange', trend: 'Hoje+', sub: 'Aguardando ação' },
        { label: 'Sessões Confirmadas', value: stats.confirmedSessions, icon: CheckCircle2, color: 'green', trend: 'Total', sub: 'Histórico completo' },
        { label: 'Faturamento Total', value: stats.revenue, icon: TrendingUp, color: 'purple', trend: 'Real', sub: 'Sessões pagas' },
    ]

    if (!mounted || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neural-authority"></div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-neural-authority tracking-tight">
                        Dashboard <span className="text-neural-conversion underline decoration-neural-authority/10">Administrativo</span>
                    </h1>
                    <p className="text-gray-400 font-medium mt-2 text-lg">
                        Bem-vindo de volta! Aqui está o resumo da sua operação hoje.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-neural-authority uppercase tracking-wider">Sistema Online</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.label} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                            {/* Decorative background shape */}
                            <div className={cn(
                                "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700",
                                card.color === 'blue' && "bg-blue-600",
                                card.color === 'orange' && "bg-orange-600",
                                card.color === 'green' && "bg-green-600",
                                card.color === 'purple' && "bg-purple-600",
                            )} />

                            <div className="flex items-center justify-between mb-8">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6",
                                    card.color === 'blue' && "bg-blue-50 text-blue-600",
                                    card.color === 'orange' && "bg-orange-50 text-orange-600",
                                    card.color === 'green' && "bg-green-50 text-green-600",
                                    card.color === 'purple' && "bg-purple-50 text-purple-600",
                                )}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter",
                                    card.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                )}>
                                    {card.trend}
                                </span>
                            </div>

                            <h3 className="text-sm font-bold text-gray-400 mb-1 tracking-tight">{card.label}</h3>
                            <p className="text-3xl font-black text-neural-authority tracking-tighter">{card.value}</p>
                            <p className="text-[11px] text-gray-400 mt-3 font-medium">{card.sub}</p>
                        </div>
                    )
                })}
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-neural-authority leading-none">Minha Agenda</h2>
                            <p className="text-gray-400 text-sm mt-2 font-medium">Próximos compromissos confirmados</p>
                        </div>
                        <Link href="/admin/agenda" className="text-xs font-black text-neural-authority hover:text-neural-conversion transition-all flex items-center gap-2 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl">
                            Gerenciar <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {stats.nextSessions.length > 0 ? (
                            stats.nextSessions.map((item, i) => (
                                <Link key={i} href={`/capsula/${item.id}`} className="flex items-center gap-5 p-5 rounded-3xl hover:bg-[#F8FAFC] border border-transparent hover:border-gray-50 transition-all cursor-pointer group">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                        {new Date(item.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-black text-neural-authority group-hover:text-neural-conversion transition-colors">
                                            {item.profiles?.full_name || 'Cliente'}
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium">Sessão Premium</p>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-100/50 text-green-700"
                                    )}>
                                        Confirmado
                                    </div>
                                    <button className="p-2 text-gray-300 hover:text-neural-authority opacity-0 group-hover:opacity-100 transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-10 font-medium italic">Nenhuma sessão confirmada para os próximos dias.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Integration */}
                <div className="space-y-8">
                    <div className="bg-neural-authority rounded-[2.5rem] p-10 text-white shadow-2xl shadow-neural-authority/20 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                        <h2 className="text-2xl font-black mb-2 relative z-10">Ações Rápidas</h2>
                        <p className="text-white/60 text-sm mb-8 relative z-10 font-medium">Atalhos para tarefas frequentes</p>

                        <div className="space-y-4 relative z-10">
                            {[
                                { label: 'Liberar Novos Horários', color: 'white/10' },
                                { label: 'Enviar Feedback em Massa', color: 'white/10' },
                                { label: 'Configurar Serviços', color: 'white/10' },
                            ].map((btn) => (
                                <button key={btn.label} className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl text-left font-bold transition-all border border-white/5 hover:border-white/20 text-sm">
                                    {btn.label}
                                </button>
                            ))}
                            <button className="w-full py-5 px-6 bg-neural-conversion text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                                Painel de Controle
                            </button>
                        </div>
                    </div>

                    {/* Simple Help Card */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 text-center">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-neural-authority mb-2">Suporte Premium</h4>
                        <p className="text-gray-400 text-xs font-medium mb-6 px-4">Precisa de ajuda com o sistema? Fale agora com nossa equipe.</p>
                        <button className="text-xs font-black text-neural-conversion uppercase tracking-widest hover:underline">
                            Abrir Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
