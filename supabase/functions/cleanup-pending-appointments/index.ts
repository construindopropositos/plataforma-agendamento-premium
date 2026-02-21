// Supabase Edge Function: cleanup-pending-appointments
// This function should be scheduled to run every 5-15 minutes using pg_cron or an external trigger.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Find and delete/update pending appointments older than 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()

    const { data, error } = await supabase
        .from('appointments')
        .delete()
        .eq('status', 'pending')
        .lt('created_at', fifteenMinutesAgo)

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ message: "Expired pending appointments cleaned up." }), {
        headers: { "Content-Type": "application/json" },
    })
})
