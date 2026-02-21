import { MercadoPagoConfig } from 'mercadopago';

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    console.warn('MERCADO_PAGO_ACCESS_TOKEN is not defined in environment variables');
}

export const mpConfig = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    options: { timeout: 5000 }
});
