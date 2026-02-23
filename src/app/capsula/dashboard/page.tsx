'use client'

import { useState, useEffect } from 'react'
import {
    Calendar,
    Clock,
    Video,
    ChevronRight,
    Star,
    Sparkles,
    FileText,
    CheckCircle2,
    ArrowUpRight,
    PlayCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getUserEvolutionData } from '@/app/actions/user'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'

export default function UserDashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        async function loadData() {
            try {
                const res = await getUserEvolutionData()
                setData(res)
            } catch (error) {
                console.error("Failed to load user data", error)
            } finally {
                setLoading(false)
            }
        }
        
        loadData()

        // Listen for auth changes (e.g. magic link login completing)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                loadData()
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    if (!mounted || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neural-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neural-authority"></div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-neural-bg p-8 text-center">
                <h2 className="text-2xl font-black text-neural-authority mb-4">Acesso Restrito</h2>
                <p className="text-gray-500 mb-8">Faça login para acessar sua Cápsula de Evolução.</p>
                <Link href="/login" className="btn-primary">Fazer Login</Link>
            </div>
        )
    }

    // Find the next session (first session in the future)
    const now = new Date()
    const upcomingSessions = data.sessions
        .filter((s: any) => new Date(s.start_time) > now)
        .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    
    const nextSession = upcomingSessions.length > 0 ? {
        date: format(new Date(upcomingSessions[0].start_time), "dd 'de' MMM", { locale: ptBR }),
        time: format(new Date(upcomingSessions[0].start_time), "HH:mm"),
        type: 'Mentoria Estratégica',
        id: upcomingSessions[0].id
    } : null

    const stats = [
        { label: 'Sessões Concluídas', value: data.totalSessions.toString().padStart(2, '0'), icon: CheckCircle2, color: 'green' },
        { label: 'Materiais Recebidos', value: '00', icon: FileText, color: 'blue' },
        { label: 'Pontos de Evolução', value: data.evolutionPoints.toString(), icon: Star, color: 'orange' },
    ]

    const pointsForNextLevel = 100 - (data.evolutionPoints % 100)
    const progressToNextLevel = (data.evolutionPoints % 100)

    return (
        <div className="space-y-12 pb-10">
            {/* Hero Section - Glassmorphism Aesthetic */}
            <div className="relative min-h-[400px] flex items-center bg-neural-authority rounded-[3rem] p-10 lg:p-16 overflow-hidden text-white shadow-2xl shadow-neural-authority/30 group">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-neural-conversion/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />

                <div className="relative z-10 w-full flex flex-col xl:flex-row items-center justify-between gap-12">
                    <div className="max-w-2xl text-center xl:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-neural-conversion mb-6 border border-white/10">
                            <Sparkles className="w-3 h-3" /> Foco na Evolução
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tighter">
                            A sua <span className="text-neural-conversion">Jornada</span> <br />
                            <span className="opacity-40">Extraordinária.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-white/50 font-medium max-w-lg mx-auto xl:mx-0">
                            {data.totalSessions === 0 
                                ? "Comece sua jornada hoje mesmo agendando sua primeira sessão de impacto."
                                : `Você já concluiu ${data.totalSessions} sessões. Mantenha a constância para alcançar o nível 0${data.level + 1}.`}
                        </p>
                    </div>

                    {/* Next Appointment Floating Card */}
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden group/card hover:-translate-y-2 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-6 opacity-20">
                            <PlayCircle className="w-24 h-24 rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-neural-conversion rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                                    <Video className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Próxima Sessão Ao Vivo</p>
                                    <p className="font-bold text-neural-conversion">{nextSession ? nextSession.type : 'Nenhuma sessão agendada'}</p>
                                </div>
                            </div>

                            <div className="flex items-end justify-between">
                                {nextSession ? (
                                    <>
                                        <div>
                                            <p className="text-4xl font-black">{nextSession.date}</p>
                                            <p className="text-sm font-bold text-white/50 mt-1 flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> às {nextSession.time}
                                            </p>
                                        </div>
                                        <Link href={`/capsula/${nextSession.id}`} className="px-8 py-4 bg-white text-neural-authority rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neural-conversion hover:text-white transition-all shadow-xl shadow-black/20">
                                            Entrar na Sala
                                        </Link>
                                    </>
                                ) : (
                                    <Link href="/capsula/agendar" className="w-full py-4 bg-white/10 hover:bg-white/20 text-center rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10">
                                        Agendar Agora
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activities */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Stats Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-default overflow-hidden relative">
                                    <div className={cn(
                                        "absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700",
                                        stat.color === 'green' && "bg-green-600",
                                        stat.color === 'blue' && "bg-blue-600",
                                        stat.color === 'orange' && "bg-orange-600",
                                    )} />
                                    <Icon className={cn(
                                        "w-8 h-8 mb-6",
                                        stat.color === 'green' && "text-green-500",
                                        stat.color === 'blue' && "text-blue-500",
                                        stat.color === 'orange' && "text-orange-500",
                                    )} />
                                    <p className="text-sm font-bold text-gray-400 tracking-tight">{stat.label}</p>
                                    <p className="text-3xl font-black text-neural-authority mt-1">{stat.value}</p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Quick Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link href="/capsula/agendar" className="bg-white p-10 rounded-[2.5rem] border-2 border-transparent hover:border-neural-authority/10 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                            <div className="bg-neural-authority/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-6">
                                <Calendar className="w-8 h-8 text-neural-authority" />
                            </div>
                            <h3 className="text-2xl font-black text-neural-authority mb-2 tracking-tight">Novo Agendamento</h3>
                            <p className="text-gray-400 font-medium mb-6">Escolha o melhor horário para sua próxima sessão de evolução.</p>
                            <div className="inline-flex items-center gap-2 text-xs font-black text-neural-authority uppercase tracking-[0.2em] group-hover:text-neural-conversion transition-colors">
                                Agendar agora <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </Link>

                        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-transparent hover:border-neural-authority/10 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative cursor-pointer">
                            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-6">
                                <FileText className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-black text-neural-authority mb-2 tracking-tight">Biblioteca VIP</h3>
                            <p className="text-gray-400 font-medium mb-6">Acesse PDFs, gravações e tarefas exclusivas do seu programa.</p>
                            <div className="inline-flex items-center gap-2 text-xs font-black text-neural-authority uppercase tracking-[0.2em] group-hover:text-neural-conversion transition-colors">
                                Explorar material <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-neural-authority leading-none tracking-tight">Cápsulas de História</h2>
                                <p className="text-gray-400 text-sm mt-2 font-medium">Recordação das suas últimas evoluções.</p>
                            </div>
                            <button className="text-[10px] font-black text-neural-authority uppercase tracking-[0.2em] bg-gray-50 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all">
                                Ver Tudo
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.sessions.slice(0, 5).map((session: any, i: number) => (
                                <div key={session.id} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-[#F8FAFC] transition-all cursor-pointer group border border-transparent hover:border-gray-50">
                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                        <CheckCircle2 className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-neural-authority group-hover:text-neural-conversion transition-colors">
                                            Sessão #{data.sessions.length - i}: Consultoria
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            Concluída em {format(new Date(session.start_time), "dd 'de' MMMM", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-gray-300 transition-transform group-hover:translate-x-2" />
                                </div>
                            ))}
                            {data.sessions.length === 0 && (
                                <p className="text-center text-gray-400 py-10 font-medium italic">Nenhuma sessão finalizada ainda.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Premium Widgets */}
                <div className="space-y-8">
                    {/* VIP Invitation */}
                    <div className={cn(
                        "rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group transition-all",
                        data.canUpgrade 
                            ? "bg-gradient-to-br from-neural-conversion to-orange-500 shadow-neural-conversion/20" 
                            : "bg-gray-800 grayscale shadow-none opacity-80"
                    )}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Star className="w-32 h-32" />
                        </div>
                        <h3 className="text-2xl font-black mb-4 relative z-10">Upgrade Master</h3>
                        <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium relative z-10">
                            {data.canUpgrade 
                                ? "Desbloqueie sessões urgentes ilimitadas e mentoria direta via WhatsApp agora mesmo."
                                : `Complete mais ${3 - data.totalSessions} sessões para desbloquear o acesso VIP e mentoria direta.`}
                        </p>
                        <button 
                            disabled={!data.canUpgrade}
                            className={cn(
                                "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all relative z-10",
                                data.canUpgrade 
                                    ? "bg-white text-neural-conversion hover:scale-105" 
                                    : "bg-white/10 text-white/40 cursor-not-allowed"
                            )}
                        >
                            {data.canUpgrade ? "Mudar para VIP" : "Bloqueado"}
                        </button>
                    </div>

                    {/* Mentor Tip Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 text-center relative overflow-hidden">
                        <div className="w-20 h-20 bg-neural-authority/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-neural-authority/10 rounded-full animate-ping opacity-20" />
                            <Sparkles className="w-10 h-10 text-neural-authority" />
                        </div>
                        <h4 className="font-black text-neural-authority text-lg mb-2">Insight do Dia</h4>
                        <div className="relative italic text-gray-400 text-sm font-medium leading-relaxed px-4">
                            "Sua visão determina seus limites. Olhe para onde quer chegar, não para onde está agora."
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-neural-authority">Evolução</h4>
                            <span className="text-[10px] font-black text-neural-conversion px-3 py-1 bg-neural-conversion/10 rounded-full uppercase tracking-widest">Nível 0{data.level}</span>
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div 
                                className="h-full bg-neural-authority rounded-full shadow-lg transition-all duration-1000" 
                                style={{ width: `${progressToNextLevel}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            Faltam {pointsForNextLevel} pontos para o próximo nível
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

