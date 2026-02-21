'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function getAdminAgendaData(startDate: string, endDate: string) {
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

    return { availability, appointments }
}

export async function addAvailabilityRule(dayOfWeek: number, startTime: string, endTime: string) {
    const supabase = await createAdminClient()

    const { data, error } = await supabase
        .from('availability')
        .insert([{
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            is_active: true
        }])
        .select()

    if (error) throw error
    revalidatePath('/admin/agenda')
    return data[0]
}

export async function deleteAvailabilityRule(id: string) {
    const supabase = await createAdminClient()

    const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', id)

    if (error) throw error
    revalidatePath('/admin/agenda')
}
