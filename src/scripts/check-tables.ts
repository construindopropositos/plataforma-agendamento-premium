import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTables() {
    console.log(`Checking project: ${supabaseUrl}`)

    const { data, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    if (error) {
        console.error('Error connecting to profiles table:', error.message)

        // Try to query the schema directly if possible via RPC or just check if any table works
        const tables = ['profiles', 'appointments', 'availability', 'meeting_notes']
        for (const table of tables) {
            const { error: tableError } = await supabase.from(table).select('*', { count: 'exact', head: true })
            if (tableError) {
                console.log(`Table ${table}: NOT FOUND or ERROR (${tableError.message})`)
            } else {
                console.log(`Table ${table}: OK`)
            }
        }
    } else {
        console.log('Tables exist and are accessible!')
    }
}

checkTables()
