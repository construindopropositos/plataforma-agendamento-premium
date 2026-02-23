import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './tailwind-built.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Consultoria Premium | Cápsula de Evolução',
    description: 'Plataforma Enterprise de Gestão de Agendamentos e Consultoria',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                {/* Ensure browser extensions don't inject attributes that break hydration */}
                <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
            </head>
            <body className={inter.className + " antialiased"} suppressHydrationWarning>
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    )
}
