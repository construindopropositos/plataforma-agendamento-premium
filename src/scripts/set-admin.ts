import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setAdmin() {
    const adminEmail = 'contato@construindopropositos.com.br'

    console.log(`Setting ${adminEmail} as the only admin...`)

    // 1. Get the target user ID
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
        console.error('Error listing users:', userError)
        return
    }

    let targetUser = users.users.find(u => u.email === adminEmail)

    if (!targetUser) {
        console.log(`User ${adminEmail} not found. Creating user...`)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: 'Proposito$@1988$@',
            email_confirm: true
        })

        if (createError) {
            console.error('Error creating user:', createError)
            return
        }
        targetUser = newUser.user
        console.log(`User ${adminEmail} created successfully.`)
    }

    // 2. Clear other admins (optional, but follows user request "apenas o email...")
    const { error: clearError } = await supabase
        .from('profiles')
        .update({ subscription_status: 'inactive' })
        .neq('id', targetUser.id)
        .eq('subscription_status', 'admin')

    if (clearError) {
        console.error('Error clearing other admins:', clearError)
    }

    // 3. Set target user as admin
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_status: 'admin' })
        .eq('id', targetUser.id)

    if (updateError) {
        console.error('Error setting target admin:', updateError)
    } else {
        console.log(`Successfully set ${adminEmail} as admin.`)
    }
}

setAdmin()
