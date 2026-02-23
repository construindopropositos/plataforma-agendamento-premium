import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setup() {
    console.log(`Setting up NEW project: ${supabaseUrl}`)

    const sqlPath = path.resolve(process.cwd(), 'src/scripts/init-db.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Since we can't run raw SQL via the standard client without an RPC, 
    // we'll try to run the set-admin script later which creates a user and works on profile table.
    // However, the best is for the user to run the SQL in the dashboard as per standard Supabase flow.

    console.log('--- PLEASE RUN THE SQL ON SUPABASE DASHBOARD FIRST ---')
    console.log('I have updated your .env file with the new project credentials.')
    console.log('Now I will attempt to set the admin user on the new project.')
}

setup()
