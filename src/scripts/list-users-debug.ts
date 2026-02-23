import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function listAllUsers() {
    console.log(`Searching users in project: ${supabaseUrl}`)

    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error listing users:', error.message)
        return
    }

    if (users.length === 0) {
        console.log('No users found in the auth system.')
    } else {
        console.log('--- REGISTERED USERS ---')
        users.forEach(u => {
            console.log(`- Email: ${u.email} (Created: ${u.created_at})`)
        })
        console.log('------------------------')
    }
}

listAllUsers()
