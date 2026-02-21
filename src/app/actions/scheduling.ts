'use server'

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { addMinutes } from 'date-fns'

export async function checkAvailability(dateStr: string) {
    try {
        const supabase = await createAdminClient()

        // dateStr is always 'YYYY-MM-DD' (local date from the client).
        const [year, month, day] = dateStr.split('-').map(Number)
        const date = new Date(year, month - 1, day, 12, 0, 0) // local noon
        const dayOfWeek = date.getDay() // 0=Sun, 1=Mon … 6=Sat

        // 1. Fetch availability rules
        const { data: rules, error: rulesError } = await supabase
            .from('availability')
            .select('*')
            .eq('day_of_week', dayOfWeek)
            .eq('is_active', true)

        if (rulesError) throw rulesError
        if (!rules || rules.length === 0) return { data: [] }

        // 2. Fetch existing appointments
        const dayStart = new Date(year, month - 1, day, 0, 0, 0).toISOString()
        const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999).toISOString()

        const { data: appointments, error: appError } = await supabase
            .from('appointments')
            .select('start_time, end_time')
            .neq('status', 'cancelled')
            .filter('start_time', 'gte', dayStart)
            .filter('start_time', 'lte', dayEnd)

        if (appError) throw appError

        const now = new Date()

        // 3. Generate slots
        const slots: { start: string; end: string }[] = []
        for (const rule of rules) {
            const [ruleStartH, ruleStartM] = rule.start_time.split(':').map(Number)
            let current = new Date(year, month - 1, day, ruleStartH, ruleStartM, 0)

            let end: Date
            if (rule.end_time === '00:00:00') {
                end = new Date(year, month - 1, day + 1, 0, 0, 0)
            } else {
                const [ruleEndH, ruleEndM] = rule.end_time.split(':').map(Number)
                end = new Date(year, month - 1, day, ruleEndH, ruleEndM, 0)
            }

            while (current < end) {
                const slotEnd = addMinutes(current, 50)
                if (slotEnd > end) break

                const isBooked = appointments?.some((app: any) => {
                    const appStart = new Date(app.start_time)
                    return current >= appStart && current < new Date(app.end_time)
                })

                if (!isBooked && current > now) {
                    slots.push({
                        start: current.toISOString(),
                        end: slotEnd.toISOString()
                    })
                }
                current = slotEnd
            }
        }

        return { data: slots }
    } catch (error: any) {
        console.error('checkAvailability error:', error)
        return { error: error.message || 'Erro ao carregar horários' }
    }
}

export async function createPendingAppointment(startTime: string, endTime: string) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Atomic-like check: verify slot is still free
        const { data: existing, error: existError } = await supabase
            .from('appointments')
            .select('id')
            .neq('status', 'cancelled')
            .filter('start_time', 'eq', startTime)
            .maybeSingle()

        if (existError) throw existError
        if (existing) throw new Error('Slot already taken')

        const { data, error } = await supabase
            .from('appointments')
            .insert([{
                user_id: user.id,
                start_time: startTime,
                end_time: endTime,
                status: 'pending'
            }])
            .select()

        if (error) throw error
        if (!data) throw new Error('Failed to create appointment')

        return { data: data[0] }
    } catch (error: any) {
        console.error('createPendingAppointment error:', error)
        return { error: error.message || 'Erro ao criar agendamento' }
    }
}
