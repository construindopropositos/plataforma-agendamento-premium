import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function listAllUsers() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) {
        console.error('ERROR:', error.message)
        return
    }

    console.log('---START---')
    users.forEach(u => console.log('USER_EMAIL:' + u.email))
    console.log('---END---')
}

listAllUsers()
