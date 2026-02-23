import DatePicker from '@/components/scheduling/DatePicker'
import { ShieldCheck, Rocket, Video, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
    return (
        <main className="min-h-screen bg-neural-bg">
            {/* Hero Section */}
            <section className="bg-neural-authority pt-20 pb-32 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 text-neural-conversion px-4 py-1 rounded-full mb-6 border border-white/20">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-tighter">Segurança Zero-Trust Ativa</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Consultoria <span className="text-neural-conversion underline">Premium</span> de Alto Impacto
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
                        Gerencie seus agendamentos com inteligência e realize sessões imersivas na nossa Cápsula de Evolução com segurança enterprise.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="#agendar" className="btn-primary flex items-center gap-2">
                            <Rocket className="w-5 h-5" /> Começar Agora
                        </Link>
                        <Link href="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white font-bold hover:bg-white/10 transition-colors">
                            Painel de Controle
                        </Link>
                    </div>
                </div>
            </section>

            {/* Demo Section: Scheduling */}
            <div id="agendar" className="max-w-6xl mx-auto px-4 -mt-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <DatePicker />
                    </div>

                    <div className="order-1 md:order-2 space-y-8">
                        <div className="card-authority">
                            <h3 className="text-xl font-bold text-neural-authority mb-2">Agendamento Inteligente</h3>
                            <p className="text-gray-600">
                                Nosso sistema utiliza Neurodesign para reduzir a carga cognitiva, destacando sempre o seu melhor horário disponível.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-neural-conversion/20 rounded-full flex items-center justify-center shrink-0">
                                <Video className="w-6 h-6 text-neural-conversion" />
                            </div>
                            <div>
                                <h4 className="font-bold text-neural-authority">Cápsula de Evolução</h4>
                                <p className="text-sm text-gray-500">Sessões integradas com Google Meet em ambiente seguro e isolado.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-neural-authority/10 rounded-full flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-6 h-6 text-neural-authority" />
                            </div>
                            <div>
                                <h4 className="font-bold text-neural-authority">Proteção de Dados</h4>
                                <p className="text-sm text-gray-500">RLS (Row Level Security) garantindo que apenas você acessa seus dados.</p>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Link href="/login" className="text-neural-authority font-bold flex items-center gap-2 hover:underline">
                                Acessar Minha Cápsula <Rocket className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-32 border-t py-12 text-center text-gray-400 text-sm">
                &copy; 2026 Plataforma de Consultoria Enterprise. Todos os direitos reservados.
            </footer>
        </main>
    )
}
