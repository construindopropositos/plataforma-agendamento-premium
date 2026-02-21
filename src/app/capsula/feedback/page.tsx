import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, ArrowLeft, Rocket } from 'lucide-react'

export default function PaymentFeedbackPage({
    searchParams
}: {
    searchParams: { status?: string }
}) {
    const status = searchParams.status

    const content = {
        success: {
            icon: <CheckCircle2 className="w-20 h-20 text-green-500" />,
            title: 'Pagamento Confirmado!',
            description: 'Sua consultoria foi agendada com sucesso. Você receberá os detalhes por e-mail e já pode acessar sua área exclusiva.',
            button: (
                <Link href="/" className="btn-primary w-full flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5" /> Ir para Início
                </Link>
            )
        },
        pending: {
            icon: <Clock className="w-20 h-20 text-amber-500" />,
            title: 'Pagamento em Processamento',
            description: 'O Mercado Pago está processando seu pagamento. Assim que for confirmado, seu horário será liberado automaticamente.',
            button: (
                <Link href="/" className="btn-primary w-full flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Voltar ao Início
                </Link>
            )
        },
        failure: {
            icon: <XCircle className="w-20 h-20 text-red-500" />,
            title: 'Algo deu errado',
            description: 'Não conseguimos processar seu pagamento. Não se preocupe, seu horário ainda pode estar disponível para uma nova tentativa.',
            button: (
                <Link href="/" className="btn-primary w-full flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Tentar Novamente
                </Link>
            )
        }
    }

    const current = (status as keyof typeof content) || 'pending'
    const view = content[current] || content.pending

    return (
        <main className="min-h-screen bg-neural-bg flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-neural-authority/5">
                <div className="flex justify-center mb-8">
                    {view.icon}
                </div>
                <h1 className="text-3xl font-black text-neural-authority mb-4">
                    {view.title}
                </h1>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    {view.description}
                </p>
                {view.button}
            </div>
        </main>
    )
}
