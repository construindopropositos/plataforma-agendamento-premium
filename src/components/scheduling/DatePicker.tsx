'use client'

import { useState, useEffect } from 'react'
import { format, addDays, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, ChevronRight, Zap, Loader2, CheckCircle2, Mail, ArrowRight } from 'lucide-react'
import { checkAvailability, createPendingAppointment } from '@/app/actions/scheduling'
import { createPaymentPreference } from '@/app/actions/payments'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function DatePicker() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [slots, setSlots] = useState<{ start: string; end: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [bookingData, setBookingData] = useState<{ id: string, initPoint: string, price: number } | null>(null)
    const [isBooking, setIsBooking] = useState(false)
    const [guestEmail, setGuestEmail] = useState('')
    const [showEmailStep, setShowEmailStep] = useState<{ start: string; end: string } | null>(null)

    useEffect(() => {
        loadSlots(selectedDate)
    }, [selectedDate])

    const loadSlots = async (date: Date) => {
        setLoading(true)
        try {
            const localDateStr = format(date, 'yyyy-MM-dd')
            const result = await checkAvailability(localDateStr)

            if (result.error) {
                console.error('Erro ao carregar horários:', result.error)
                return
            }

            setSlots(result.data || [])
        } catch (error) {
            console.error('Erro fatal loadSlots:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBooking = async (slot: { start: string; end: string }) => {
        // Se for visitante e ainda não forneceu e-mail, mostra o passo do e-mail
        if (!showEmailStep && !guestEmail) {
            setShowEmailStep(slot)
            return
        }

        setIsBooking(true)
        try {
            // 1. Create Pending Appointment
            const result = await createPendingAppointment(slot.start, slot.end, guestEmail)

            if (result.error) {
                if (result.error === 'Unauthorized') {
                    toast.info('Login necessário', {
                        description: 'Redirecionando para autenticação segura...'
                    })
                    setTimeout(() => window.location.href = '/login', 2000)
                    return
                }
                throw new Error(result.error)
            }

            const data = result.data!

            // 2. Create Mercado Pago Preference
            const paymentResult = await createPaymentPreference(data.id)

            if (paymentResult.error) {
                throw new Error(paymentResult.error)
            }

            const payment = paymentResult.data!

            setBookingData({
                id: data.id,
                initPoint: payment.initPoint || '',
                price: payment.price || 200
            })

            toast.success('Horário reservado!', {
                description: 'Finalize o pagamento para confirmar.',
                icon: <CheckCircle2 className="text-green-500" />
            })
            setShowEmailStep(null)
        } catch (error: any) {
            toast.error('Ocorreu um erro', {
                description: error.message || 'Tente selecionar outro horário.'
            })
        } finally {
            setIsBooking(false)
        }
    }

    if (showEmailStep) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto p-10 bg-white rounded-[3rem] shadow-2xl border border-neural-authority/5 text-center"
            >
                <div className="w-16 h-16 bg-neural-authority/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-neural-authority" />
                </div>
                <h3 className="text-2xl font-black text-neural-authority mb-2">Quase lá!</h3>
                <p className="text-sm text-gray-400 mb-8 px-2 font-medium">Insira seu e-mail para receber o link da consultoria e o comprovante.</p>

                <form onSubmit={(e) => { e.preventDefault(); handleBooking(showEmailStep); }} className="space-y-4">
                    <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-neural-authority outline-none font-bold text-neural-authority transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isBooking}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-3 group"
                    >
                        {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Gerar Pagamento Seguro
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowEmailStep(null)}
                        className="text-[10px] font-black uppercase tracking-widest text-neural-authority/30 hover:text-neural-authority/60 transition-colors pt-2"
                    >
                        ← Voltar e trocar horário
                    </button>
                </form>
            </motion.div>
        )
    }

    if (bookingData) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto p-8 text-center bg-white rounded-3xl shadow-2xl border border-neural-authority/10"
            >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-neural-authority mb-2">Reserva Garantida</h2>
                <div className="bg-neural-bg/50 rounded-2xl py-4 px-6 mb-8 border border-dashed border-neural-authority/10">
                    <p className="text-xs font-black uppercase tracking-widest text-neural-authority/40 mb-1">Valor da Sessão</p>
                    <p className="text-3xl font-black text-neural-authority">R$ {bookingData.price}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Preço especial para seu perfil</p>
                </div>

                <p className="text-xs text-gray-500 mb-8 leading-relaxed">
                    Seu horário foi bloqueado por **15 minutos**. <br />
                    Ao clicar abaixo, você será levado ao checkout seguro.
                </p>

                <a
                    href={bookingData.initPoint}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
                >
                    <Zap className="w-5 h-5 fill-neural-conversion text-neural-conversion" />
                    Pagar no Mercado Pago
                </a>
            </motion.div>
        )
    }

    return (
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/20">
            {/* Header / Brand Status */}
            <div className="bg-gradient-to-br from-neural-authority to-[#001f3f] p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                        <Zap className="w-3 h-3 text-neural-conversion fill-neural-conversion" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disponibilidade Real</span>
                    </div>
                </div>
                <h2 className="text-3xl font-black leading-tight tracking-tight mb-2">
                    Agende sua <br /><span className="text-neural-conversion underline decoration-2 underline-offset-4">Evolução</span>
                </h2>
                <p className="text-sm text-white/60 font-medium">Sessões de 60 minutos com foco em resultados exponenciais.</p>
            </div>

            {/* Content Area */}
            <div className="p-8 space-y-8">
                {/* Date Selection Wheel-like Horizontal List */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-neural-authority/40 px-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Calendário Ativo</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                        {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                            const date = addDays(new Date(), offset)
                            const isSelected = isSameDay(date, selectedDate)
                            return (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    key={offset}
                                    onClick={() => setSelectedDate(date)}
                                    className={cn(
                                        "flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all border",
                                        isSelected
                                            ? "bg-neural-authority text-white border-neural-authority shadow-lg shadow-neural-authority/30 scale-105"
                                            : "bg-gray-50 text-neural-authority border-transparent hover:border-gray-200"
                                    )}
                                >
                                    <span className="text-[9px] font-black uppercase opacity-60 mb-1">
                                        {format(date, "EEE", { locale: ptBR })}
                                    </span>
                                    <span className="text-xl font-black leading-none">{format(date, "d")}</span>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-neural-authority/40">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Slots de Impacto</span>
                        </div>
                        <span className="text-[10px] font-bold text-neural-conversion px-2 py-0.5 bg-neural-conversion/10 rounded-full">60 min</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 gap-3"
                            >
                                {[1, 2, 4, 5].map(i => (
                                    <div key={i} className="h-[52px] bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
                                ))}
                            </motion.div>
                        ) : slots.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-2 gap-3"
                            >
                                {slots.map((slot, i) => (
                                    <motion.button
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={i}
                                        onClick={() => handleBooking(slot)}
                                        disabled={isBooking}
                                        className="group relative h-[52px] bg-white border border-gray-100 text-neural-authority font-black rounded-2xl flex items-center justify-center transition-all hover:border-neural-authority hover:shadow-xl disabled:opacity-50"
                                    >
                                        <span className="z-10">{format(new Date(slot.start), "HH:mm")}</span>
                                        <div className="absolute inset-0 bg-neural-authority/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-2xl" />
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
                            >
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Agenda Lotada</p>
                                <p className="text-[10px] text-gray-300 mt-1">Selecione outra data no topo.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Assurance */}
            <div className="p-8 pt-0 flex items-center justify-center gap-2 opacity-30 grayscale saturate-0 pointer-events-none">
                <div className="h-6 w-16 bg-gray-400 rounded-sm" />
                <div className="h-4 w-4 rounded-full bg-gray-400" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Powered by Evolution Architecture</span>
            </div>

            {isBooking && (
                <div className="absolute inset-0 bg-neural-authority/10 backdrop-blur-sm flex items-center justify-center z-50">
                    <Loader2 className="w-10 h-10 text-neural-authority animate-spin" />
                </div>
            )}
        </div>
    )
}
