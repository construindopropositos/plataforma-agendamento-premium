import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { mpConfig } from '@/lib/mercado-pago'
import { Payment } from 'mercadopago'

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const id = searchParams.get('data.id') || searchParams.get('id')

    console.log(`[MP Webhook] Received notification: type=${type}, id=${id}`)

    if (type === 'payment' && id) {
        try {
            const paymentClient = new Payment(mpConfig)
            const payment = await paymentClient.get({ id })

            if (payment.status === 'approved') {
                const appointmentId = payment.external_reference
                console.log(`[MP Webhook] Payment approved for appointment: ${appointmentId}`)

                const supabase = await createAdminClient()

                // Update appointment status to confirmed
                const { error } = await supabase
                    .from('appointments')
                    .update({
                        status: 'confirmed',
                        payment_id: id.toString()
                    })
                    .eq('id', appointmentId)

                if (error) {
                    console.error('[MP Webhook] Error updating appointment:', error)
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
                }

                console.log(`[MP Webhook] Appointment ${appointmentId} confirmed successfully.`)
            }
        } catch (error) {
            console.error('[MP Webhook] Error processing payment:', error)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    }

    // Always return 200 to Mercado Pago to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 })
}
