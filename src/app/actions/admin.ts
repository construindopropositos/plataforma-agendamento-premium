'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function getAdminAgendaData(startDate: string, endDate: string) {
    try {
        const supabase = await createAdminClient()

        // Fetch all availability rules
        const { data: availability, error: availError } = await supabase
            .from('availability')
            .select('*')
            .eq('is_active', true)

        if (availError) throw availError

        // Fetch all appointments in range
        const { data: appointments, error: appError } = await supabase
            .from('appointments')
            .select('*, profiles(full_name)')
            .filter('start_time', 'gte', startDate)
            .filter('start_time', 'lte', endDate)
            .neq('status', 'cancelled')

        if (appError) throw appError

        return { data: { availability, appointments } }
    } catch (error: any) {
        console.error('getAdminAgendaData error:', error)
        return { error: error.message || 'Erro inesperado ao buscar dados' }
    }
}

export async function addAvailabilityRule(dayOfWeek: number, startTime: string, endTime: string) {
    try {
        const supabase = await createAdminClient()

        const { data, error } = await supabase
            .from('availability')
            .insert([{
                day_of_week: dayOfWeek,
                start_time: startTime,
                end_time: endTime,
                is_active: true,
                is_visible: true
            }])
            .select()

        if (error) throw error
        revalidatePath('/admin/agenda')
        return { data: data[0] }
    } catch (error: any) {
        console.error('addAvailabilityRule error:', error)
        return { error: error.message || 'Erro ao adicionar disponibilidade' }
    }
}

export async function deleteAvailabilityRule(id: string) {
    try {
        const supabase = await createAdminClient()

        const { error } = await supabase
            .from('availability')
            .delete()
            .eq('id', id)

        if (error) throw error
        revalidatePath('/admin/agenda')
        return { success: true }
    } catch (error: any) {
        console.error('deleteAvailabilityRule error:', error)
        return { error: error.message || 'Erro ao deletar regra' }
    }
}

export async function toggleAvailabilityVisibility(id: string, isVisible: boolean) {
    try {
        const supabase = await createAdminClient()

        const { error } = await supabase
            .from('availability')
            .update({ is_visible: isVisible })
            .eq('id', id)

        if (error) throw error
        revalidatePath('/admin/agenda')
        return { success: true }
    } catch (error: any) {
        console.error('toggleAvailabilityVisibility error:', error)
        return { error: error.message || 'Erro ao alterar visibilidade' }
    }
}

export async function getAdminStats() {
    try {
        const supabase = await createAdminClient()

        // 1. Total revenue (only confirmed sessions)
        const { data: payments, error: payError } = await supabase
            .from('appointments')
            .select('price')
            .eq('status', 'confirmed')

        if (payError) throw payError
        const totalRevenue = payments?.reduce((acc, curr) => acc + Number(curr.price), 0) || 0

        // 2. Pending sessions for today onwards
        const today = new Date().toISOString().split('T')[0]
        const { count: pendingSessions, error: countError } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
            .gte('start_time', today)

        if (countError) throw countError

        // 3. Unique clients (both logged in and guests)
        const { data: clients, error: clientError } = await supabase
            .from('appointments')
            .select('client_id, guest_email')

        if (clientError) throw clientError

        const uniqueClientIdentifiers = new Set()
        clients?.forEach(c => {
            if (c.client_id) uniqueClientIdentifiers.add(c.client_id)
            if (c.guest_email) uniqueClientIdentifiers.add(c.guest_email)
        })
        const uniqueClients = uniqueClientIdentifiers.size

        // 4. Confirmed sessions (total for stats)
        const { count: confirmedSessions, error: confError } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'confirmed')

        if (confError) throw confError

        // 5. Next confirmed sessions
        const { data: nextSessions, error: nextError } = await supabase
            .from('appointments')
            .select('*, profiles(full_name)')
            .eq('status', 'confirmed')
            .gte('start_time', today)
            .order('start_time', { ascending: true })
            .limit(5)

        if (nextError) throw nextError

        return {
            data: {
                totalRevenue,
                pendingSessions: pendingSessions || 0,
                confirmedSessions: confirmedSessions || 0,
                uniqueClients,
                nextSessions: nextSessions || []
            }
        }
    } catch (error: any) {
        console.error("getAdminStats error:", error)
        return { error: error.message || "Erro ao buscar métricas" }
    }
}
