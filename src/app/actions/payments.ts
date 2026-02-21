'use server'

import { createClient } from '@/lib/supabase-server'
import { mpConfig } from '@/lib/mercado-pago'
import { Preference } from 'mercadopago'

export async function createPaymentPreference(appointmentId: string, guestEmail?: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // 1. Fetch appointment
        const { data: appointment, error: appError } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', appointmentId)
            .maybeSingle()

        if (appError) throw appError
        if (!appointment) throw new Error('Appointment not found')

        // Prioritize logged user email, fallback to guestEmail, then appointment data
        const payerEmail = user?.email || guestEmail || appointment.guest_email

        // 2. Calculate dynamic price (Ladder: 200 -> 150 -> 120 -> 100)
        let price = 200

        if (user) {
            const { count, error: countError } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('status', 'confirmed')

            if (countError) {
                console.warn('Could not fetch session count, defaulting to base price:', countError)
            }

            const sessions = count || 0
            if (sessions === 1) price = 150
            else if (sessions === 2) price = 120
            else if (sessions >= 3) price = 100
        }

        // 3. Create Mercado Pago Preference
        const preference = new Preference(mpConfig)

        // Use the app URL from env or fallback
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: appointmentId,
                        title: 'Consultoria Premium - Cápsula de Evolução',
                        quantity: 1,
                        unit_price: price,
                        currency_id: 'BRL'
                    }
                ],
                payer: {
                    email: payerEmail || 'cliente@exemplo.com'
                },
                external_reference: appointmentId,
                back_urls: {
                    success: `${baseUrl}/capsula/feedback?status=success`,
                    failure: `${baseUrl}/capsula/feedback?status=failure`,
                    pending: `${baseUrl}/capsula/feedback?status=pending`,
                },
                auto_return: 'approved',
                notification_url: `${baseUrl}/api/webhooks/mercadopago`,
                payment_methods: {
                    excluded_payment_types: [],
                    installments: 12
                }
            }
        })

        return {
            data: {
                preferenceId: response.id,
                initPoint: response.init_point,
                price
            }
        }
    } catch (error: any) {
        console.error('Error creating MP preference:', error)
        return { error: error.message || 'Erro ao gerar link de pagamento' }
    }
}
