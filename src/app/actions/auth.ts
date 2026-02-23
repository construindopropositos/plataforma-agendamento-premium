'use server'

import { createClient } from '@/lib/supabase-server'

export async function getUserProfile() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) return null

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) return null

        return profile
    } catch (error) {
        console.error('Error getting user profile:', error)
        return null
    }
}
