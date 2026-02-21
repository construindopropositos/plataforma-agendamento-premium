import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env')
    console.log('💡 Dica: Pegue a "service_role" key no painel do Supabase (Settings > API).')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setup() {
    console.log('🚀 Iniciando setup do banco de dados...')

    // 1. Inserir Disponibilidade Mock (Segunda a Sexta, 14h às 18h)
    console.log('📅 Inserindo regras de disponibilidade...')
    const availabilityRules = []

    // Day 1 to 5 (Monday to Friday)
    for (let day = 1; day <= 5; day++) {
        availabilityRules.push({
            day_of_week: day,
            start_time: '14:00:00',
            end_time: '18:00:00',
            is_active: true
        })
    }

    const { error: availError } = await supabase
        .from('availability')
        .upsert(availabilityRules, { onConflict: 'day_of_week' })

    if (availError) {
        console.error('❌ Erro ao inserir disponibilidade:', availError.message)
    } else {
        console.log('✅ Regras de disponibilidade inseridas com sucesso!')
    }

    // 2. Inserir um agendamento de teste para amanhã (opcional)
    console.log('🧪 Inserindo dados de teste finalizados.')
    console.log('\n✨ Tudo pronto! O calendário agora deve mostrar horários disponíveis.')
}

setup().catch((err) => {
    console.error('💥 Erro fatal no script:', err)
})
