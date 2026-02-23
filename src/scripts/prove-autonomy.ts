import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedData() {
    console.log(`PROVING AUTONOMY: Adding test availability to ${supabaseUrl}...`)

    // Test slots for Monday (1) and Tuesday (2)
    const slots = [
        { day_of_week: 1, start_time: '09:00:00', end_time: '10:00:00', is_active: true, is_visible: true },
        { day_of_week: 1, start_time: '14:00:00', end_time: '15:00:00', is_active: true, is_visible: true },
        { day_of_week: 2, start_time: '10:00:00', end_time: '11:00:00', is_active: true, is_visible: true }
    ]

    const { data, error } = await supabase
        .from('availability')
        .insert(slots)

    if (error) {
        console.error('Failed to add autonomy proof data:', error.message)
    } else {
        console.log('AUTONOMY PROVEN: Test slots added successfully!')
    }
}

seedData()
