'use client'

import { useState } from 'react'
import { X, Clock, Save } from 'lucide-react'
import { addAvailabilityRule } from '@/app/actions/admin'
import { toast } from 'sonner'

interface AvailabilityModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const DAYS = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
]

export default function AvailabilityModal({ isOpen, onClose, onSuccess }: AvailabilityModalProps) {
    const [dayOfWeek, setDayOfWeek] = useState(1)
    const [startTime, setStartTime] = useState('14:00')
    const [endTime, setEndTime] = useState('23:50')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const toastId = toast.loading('Salvando bloco de disponibilidade...')

        try {
            const result = await addAvailabilityRule(dayOfWeek, `${startTime}:00`, `${endTime}:00`)

            if (result.error) {
                toast.error('Erro ao salvar', {
                    id: toastId,
                    description: result.error
                })
                return
            }

            toast.success('Horário salvo com sucesso!', {
                id: toastId,
                description: `${DAYS.find(d => d.value === dayOfWeek)?.label}, das ${startTime} às ${endTime}.`
            })
            onSuccess()
            onClose()
        } catch (error: any) {
            console.error('Erro ao adicionar disponibilidade:', error)
            toast.error('Erro ao salvar', {
                id: toastId,
                description: error?.message || 'Verifique as configurações e tente novamente.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-br from-neural-authority to-[#001f3f] p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-black flex items-center gap-2">
                        <Clock className="w-5 h-5 text-neural-conversion" /> Novo Bloco de Horário
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Dia da Semana</label>
                        <select
                            value={dayOfWeek}
                            onChange={(e) => setDayOfWeek(Number(e.target.value))}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold text-neural-authority focus:ring-2 focus:ring-neural-authority focus:border-transparent outline-none transition-all"
                        >
                            {DAYS.map(day => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Início</label>
                            <input
                                type="time"
                                value={startTime}
                                min="00:00"
                                max="23:10"
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold text-neural-authority focus:ring-2 focus:ring-neural-authority focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Fim (até 00:00)</label>
                            <input
                                type="time"
                                value={endTime}
                                min="00:50"
                                max="23:59"
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold text-neural-authority focus:ring-2 focus:ring-neural-authority focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-neural-authority/5 rounded-2xl p-4 border border-neural-authority/10">
                        <p className="text-xs font-bold text-neural-authority/70">
                            ℹ️ Sessões de <strong>50 minutos</strong>. O sistema irá gerar automaticamente os slots dentro deste bloco.
                        </p>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-neural-authority text-white px-6 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-neural-authority/20"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Salvando...
                                </span>
                            ) : (
                                <><Save className="w-4 h-4" /> Salvar Horário</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
