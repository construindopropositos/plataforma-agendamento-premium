'use server'

import { createClient } from '@/lib/supabase-server'

export async function getUserEvolutionData() {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        // Fetch confirmed sessions for the user
        const { data: sessions, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('client_id', user.id)
            .eq('status', 'confirmed')
            .order('start_time', { ascending: false })

        if (error) throw error

        const totalSessions = sessions?.length || 0
        const evolutionPoints = totalSessions * 50
        const level = Math.floor(evolutionPoints / 100) + 1
        const canUpgrade = totalSessions >= 3

        return {
            level,
            evolutionPoints,
            totalSessions,
            canUpgrade,
            sessions: sessions || []
        }
    } catch (error) {
        console.error('getUserEvolutionData error:', error)
        return null
    }
}
