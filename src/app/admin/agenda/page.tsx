'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
    ChevronLeft,
    ChevronRight,
    Settings,
    Trash2,
    Clock,
    Calendar as CalendarIcon,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAdminAgendaData, deleteAvailabilityRule, toggleAvailabilityVisibility } from '@/app/actions/admin'
import AvailabilityModal from '@/components/admin/AvailabilityModal'

export default function AdminAgendaPage() {
    const [currentWeek, setCurrentWeek] = useState(new Date())
    const [appointments, setAppointments] = useState<any[]>([])
    const [availability, setAvailability] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 })

    useEffect(() => {
        fetchData()
    }, [currentWeek])

    const fetchData = async () => {
        setLoading(true)
        try {
            const endOfWeek = addDays(startDate, 7).toISOString()
            const result = await getAdminAgendaData(startDate.toISOString(), endOfWeek)

            if (result.error) {
                console.error('Erro na agenda:', result.error)
                return
            }

            const { availability, appointments } = result.data || { availability: [], appointments: [] }
            setAvailability(availability || [])
            setAppointments(appointments || [])
        } catch (error) {
            console.error('Erro ao buscar dados da agenda:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteRule = async (id: string) => {
        if (!confirm('Remover este horário de disponibilidade?')) return
        try {
            const result = await deleteAvailabilityRule(id)
            if (result.error) alert('Erro: ' + result.error)
            else fetchData()
        } catch (error) {
            alert('Erro ao deletar regra.')
        }
    }

    const hours = Array.from({ length: 15 }, (_, i) => i + 8) // 8:00 to 22:00

    const toMins = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number)
        return h * 60 + m
    }

    return (
        <div className="space-y-12 pb-10">
            {/* Header */}
            <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-neural-authority tracking-tight">
                        Minha <span className="text-neural-conversion">Agenda</span>
                    </h1>
                    <p className="text-gray-400 font-medium mt-2 text-lg">
                        Gerencie seus horários e compromissos.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="flex items-center bg-white shadow-sm rounded-2xl border border-gray-100 p-1.5 flex-1 xl:flex-none">
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, -7))} className="p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-neural-authority">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="px-6 font-black text-neural-authority whitespace-nowrap min-w-[200px] text-center text-sm uppercase tracking-wider">
                            {format(startDate, "d 'de' MMM", { locale: ptBR })} - {format(addDays(startDate, 6), "d 'de' MMM", { locale: ptBR })}
                        </div>
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, 7))} className="p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-neural-authority">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary h-[60px] flex-1 xl:flex-none px-10"
                    >
                        <Settings className="w-4 h-4" /> Configurar Horários
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden relative">
                {/* Grid Navigation / Days */}
                <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-gray-50/50 border-b border-gray-100 sticky top-0 z-20 backdrop-blur-md">
                    <div className="p-6 border-r border-gray-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-300" />
                    </div>
                    {[0, 1, 2, 3, 4, 5, 6].map(i => {
                        const date = addDays(startDate, i)
                        const isToday = isSameDay(date, new Date())
                        return (
                            <div key={i} className="p-6 text-center border-r border-gray-100 last:border-r-0">
                                <p className="text-[10px] uppercase font-black text-gray-400 mb-2 tracking-widest">
                                    {format(date, "EEE", { locale: ptBR })}
                                </p>
                                <div className={cn(
                                    "w-12 h-12 flex items-center justify-center mx-auto rounded-2xl font-black text-xl transition-all",
                                    isToday
                                        ? "bg-neural-authority text-white shadow-lg shadow-neural-authority/30 scale-110"
                                        : "text-neural-authority bg-white border border-gray-100 shadow-sm"
                                )}>
                                    {format(date, "d")}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Grid Scrollable Body */}
                <div className="relative min-w-[1000px]">
                    {loading && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-neural-authority border-t-transparent shadow-xl"></div>
                        </div>
                    )}

                    {hours.map(hour => (
                        <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-50 last:border-b-0 group/row">
                            <div className="p-6 flex flex-col items-center justify-center border-r border-gray-100 bg-gray-50/20 group-hover/row:bg-gray-50/50 transition-colors">
                                <span className="text-sm font-black text-neural-authority opacity-40 group-hover/row:opacity-100 transition-all">{hour}:00</span>
                            </div>

                            {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                const dayDate = addDays(startDate, i)
                                const dayOfWeek = dayDate.getDay()
                                const cellStartMins = hour * 60
                                const cellEndMins = (hour + 1) * 60

                                const matchingRules = availability.filter(rule => {
                                    const ruleStartMins = toMins(rule.start_time)
                                    const ruleEndRaw = rule.end_time === '00:00:00' ? '24:00' : rule.end_time
                                    const ruleEndMins = ruleEndRaw === '24:00' ? 24 * 60 : toMins(ruleEndRaw)
                                    return rule.day_of_week === dayOfWeek &&
                                        ruleStartMins < cellEndMins &&
                                        ruleEndMins > cellStartMins
                                })

                                const slotApps = appointments.filter(app => {
                                    const appStart = new Date(app.start_time)
                                    return isSameDay(appStart, dayDate) && appStart.getHours() === hour
                                })

                                const isAvailable = matchingRules.length > 0
                                const mainRule = matchingRules[0]

                                return (
                                    <div key={i} className={cn(
                                        "relative border-r border-gray-50 last:border-r-0 p-3 min-h-[100px] transition-all group/cell",
                                        !isAvailable && "bg-gray-50/10",
                                        isAvailable && !slotApps.length && "hover:bg-green-50/30"
                                    )}>
                                        {/* Availability Indicator */}
                                        {isAvailable && !slotApps.length && (
                                            <div className={cn(
                                                "h-full w-full rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all relative overflow-hidden",
                                                mainRule.is_visible
                                                    ? "bg-green-50/20 border-green-100/50"
                                                    : "bg-gray-100/30 border-dashed border-gray-200"
                                            )}>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-all scale-75 group-hover/cell:scale-100">
                                                    <button
                                                        onClick={async () => {
                                                            const res = await toggleAvailabilityVisibility(mainRule.id, !mainRule.is_visible)
                                                            if (res.error) alert(res.error)
                                                            else fetchData()
                                                        }}
                                                        className={cn(
                                                            "p-2 rounded-xl border transition-all",
                                                            mainRule.is_visible
                                                                ? "bg-white text-green-600 border-green-100 shadow-sm"
                                                                : "bg-white text-gray-400 border-gray-100 shadow-sm"
                                                        )}
                                                    >
                                                        {mainRule.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRule(mainRule.id)}
                                                        className="p-2 bg-white text-red-300 hover:text-red-500 rounded-xl border border-gray-100 shadow-sm transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-tighter opacity-30",
                                                    mainRule.is_visible ? "text-green-600" : "text-gray-400"
                                                )}>
                                                    {mainRule.is_visible ? 'Ativo' : 'Oculto'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Appointments */}
                                        {slotApps.map((app, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "absolute inset-2 p-4 rounded-2xl flex flex-col justify-between shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl z-10 border-l-[6px] group/app",
                                                    app.status === 'confirmed'
                                                        ? "bg-neural-authority text-white border-white/20"
                                                        : "bg-white text-neural-authority border-neural-conversion shadow-neural-conversion/10"
                                                )}
                                            >
                                                <div className="relative">
                                                    <div className={cn(
                                                        "text-[9px] font-black uppercase opacity-60 flex items-center gap-1 mb-1 tracking-widest",
                                                        app.status === 'confirmed' ? "text-white/60" : "text-gray-400"
                                                    )}>
                                                        <CalendarIcon className="w-2.5 h-2.5" /> Sessão
                                                    </div>
                                                    <p className="font-black text-xs leading-none truncate max-w-[80%]">
                                                        {app.profiles?.full_name?.split(' ')[0] || 'Cliente'}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <span className={cn(
                                                        "text-[8px] font-black py-1 px-3 rounded-full uppercase tracking-tighter",
                                                        app.status === 'confirmed' ? "bg-white/20 text-white" : "bg-neural-conversion/10 text-neural-conversion"
                                                    )}>
                                                        {app.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 opacity-50 group-hover/app:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AvailabilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    )
}
