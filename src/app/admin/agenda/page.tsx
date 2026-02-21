'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Filter, Settings, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAdminAgendaData, deleteAvailabilityRule } from '@/app/actions/admin'
import AvailabilityModal from '@/components/admin/AvailabilityModal'

export default function AdminAgendaPage() {
    const [currentWeek, setCurrentWeek] = useState(new Date())
    const [appointments, setAppointments] = useState<any[]>([])
    const [availability, setAvailability] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday

    useEffect(() => {
        fetchData()
    }, [currentWeek])

    const fetchData = async () => {
        setLoading(true)
        try {
            const endOfWeek = addDays(startDate, 7).toISOString()
            const { availability, appointments } = await getAdminAgendaData(startDate.toISOString(), endOfWeek)
            setAvailability(availability || [])
            setAppointments(appointments || [])
        } catch (error) {
            console.error('Erro ao buscar dados da agenda:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteRule = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este horário de disponibilidade?')) return
        try {
            await deleteAvailabilityRule(id)
            fetchData()
        } catch (error) {
            alert('Erro ao deletar regra.')
        }
    }

    const hours = Array.from({ length: 16 }, (_, i) => i + 8) // 8:00 to 23:00

    // Helper: converts "HH:MM:SS" or "HH:MM" to total minutes for precise comparison
    const toMins = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number)
        return h * 60 + m
    }

    return (
        <div className="p-8 bg-neural-bg min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-neural-authority mb-2 tracking-tight">Painel de Controle <span className="text-neural-conversion">Master</span></h1>
                    <p className="text-gray-500 font-medium">Gerenciamento dinâmico de sessões e horários premium.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-white shadow-sm rounded-2xl border border-gray-100 p-1.5">
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, -7))} className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <div className="px-6 font-bold text-neural-authority whitespace-nowrap min-w-[220px] text-center">
                            {format(startDate, "d 'de' MMM", { locale: ptBR })} - {format(addDays(startDate, 6), "d 'de' MMM", { locale: ptBR })}
                        </div>
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, 7))} className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2 h-[52px]"
                    >
                        <Settings className="w-4 h-4" /> Configurar Horários
                    </button>
                </div>
            </div>

            {/* Status Legend */}
            <div className="flex gap-6 mb-8 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-dashed border-gray-300"></div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neural-authority"></div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Agendado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neural-conversion"></div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aguardando</span>
                </div>
            </div>

            {/* Weekly Grid */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden overflow-x-auto">
                <div className="min-w-[1000px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-gray-50/50 border-b border-gray-100">
                        <div className="p-6 border-r border-gray-100" />
                        {[0, 1, 2, 3, 4, 5, 6].map(i => {
                            const date = addDays(startDate, i)
                            const isToday = isSameDay(date, new Date())
                            return (
                                <div key={i} className="p-6 text-center border-r border-gray-100 last:border-r-0">
                                    <p className="text-[10px] uppercase font-black text-gray-400 mb-2 tracking-tighter">
                                        {format(date, "EEEE", { locale: ptBR })}
                                    </p>
                                    <p className={cn(
                                        "w-10 h-10 flex items-center justify-center mx-auto rounded-2xl font-black text-lg transition-all shadow-sm",
                                        isToday ? "bg-neural-authority text-white scale-110 shadow-neural-authority/20" : "text-neural-authority bg-white border border-gray-100"
                                    )}>
                                        {format(date, "d")}
                                    </p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Grid Content */}
                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-neural-authority border-t-transparent"></div>
                            </div>
                        )}

                        {hours.map(hour => (
                            <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-50 last:border-b-0 min-h-[85px]">
                                <div className="p-5 flex flex-col items-end justify-center border-r border-gray-100 bg-gray-50/30">
                                    <span className="text-sm font-black text-neural-authority">{hour}:00</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">AM/PM</span>
                                </div>
                                {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                    const dayDate = addDays(startDate, i)
                                    const dayOfWeek = dayDate.getDay() // 0-6

                                    // 1. Check if this hour-cell is covered by an availability rule
                                    //    A cell at hour H covers minutes [H*60 .. H*60+59]
                                    //    A rule covers [ruleStart .. ruleEnd)
                                    //    They overlap if ruleStart < (H+1)*60 AND ruleEnd > H*60
                                    const cellStartMins = hour * 60
                                    const cellEndMins = (hour + 1) * 60

                                    const matchingRules = availability.filter(rule => {
                                        const ruleStartMins = toMins(rule.start_time)
                                        // Treat 00:00 as 24:00 (midnight = end of day)
                                        const ruleEndRaw = rule.end_time === '00:00:00' ? '24:00' : rule.end_time
                                        const ruleEndMins = ruleEndRaw === '24:00' ? 24 * 60 : toMins(ruleEndRaw)
                                        return rule.day_of_week === dayOfWeek &&
                                            ruleStartMins < cellEndMins &&
                                            ruleEndMins > cellStartMins
                                    })

                                    // Build readable slot labels within this cell
                                    const slotLabels: string[] = []
                                    matchingRules.forEach(rule => {
                                        const ruleStartMins = toMins(rule.start_time)
                                        const ruleEndRaw = rule.end_time === '00:00:00' ? '24:00' : rule.end_time
                                        const ruleEndMins = ruleEndRaw === '24:00' ? 24 * 60 : toMins(ruleEndRaw)
                                        // iterate 50-min slots within this cell
                                        let cur = Math.max(ruleStartMins, cellStartMins)
                                        const cellMax = Math.min(ruleEndMins, cellEndMins)
                                        while (cur + 50 <= ruleEndMins && cur < cellMax) {
                                            const h = Math.floor(cur / 60).toString().padStart(2, '0')
                                            const m = (cur % 60).toString().padStart(2, '0')
                                            slotLabels.push(`${h}:${m}`)
                                            cur += 50
                                        }
                                    })

                                    // 2. Check for appointments in this cell
                                    const slotApps = appointments.filter(app => {
                                        const appStart = new Date(app.start_time)
                                        return isSameDay(appStart, dayDate) && appStart.getHours() === hour
                                    })

                                    const isAvailable = matchingRules.length > 0

                                    return (
                                        <div key={i} className={cn(
                                            "relative border-r border-gray-50 last:border-r-0 p-2 group transition-colors",
                                            !isAvailable && "bg-gray-50/20"
                                        )}>
                                            {/* Available Base Layer */}
                                            {isAvailable && !slotApps.length && (
                                                <div className="absolute inset-2 border-2 border-dashed border-green-200 bg-green-50/40 rounded-xl flex flex-col items-center justify-center group-hover:bg-green-50 transition-all cursor-default overflow-hidden gap-0.5 py-1">
                                                    {slotLabels.map(label => (
                                                        <span key={label} className="text-[9px] font-black text-green-600/60 leading-none">{label}</span>
                                                    ))}
                                                    <button
                                                        onClick={() => handleDeleteRule(matchingRules[0].id)}
                                                        className="mt-1 p-1.5 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remover disponibilidade"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Appointment Layer */}
                                            {slotApps.map((app, idx) => (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        "absolute inset-2 p-3 rounded-xl flex flex-col justify-between shadow-xl transition-all hover:scale-[1.03] z-10 border-l-[6px]",
                                                        app.status === 'confirmed'
                                                            ? "bg-neural-authority text-white border-white/20"
                                                            : "bg-neural-conversion text-white border-white/20 shadow-neural-conversion/20"
                                                    )}
                                                >
                                                    <div>
                                                        <div className="text-[10px] font-black uppercase opacity-60 flex items-center gap-1 mb-0.5">
                                                            <CalendarIcon className="w-2.5 h-2.5" /> Sessão
                                                        </div>
                                                        <div className="font-bold text-xs truncate leading-tight">
                                                            {app.profiles?.full_name || 'Agendamento'}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black py-0.5 px-2 bg-white/20 rounded-full lowercase">
                                                            {app.status}
                                                        </span>
                                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                            <ChevronRight className="w-3 h-3 translate-x-px" />
                                                        </div>
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
