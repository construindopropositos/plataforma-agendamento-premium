'use client'

import { useState } from 'react'
import {
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Download
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState('')

    // Mock data for clients
    const clients = [
        { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 98888-7777', status: 'Ativo', sessions: 12, lastSession: '15 Fev 2024' },
        { id: '2', name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 97777-6666', status: 'Pendente', sessions: 0, lastSession: '-' },
        { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', phone: '(11) 96666-5555', status: 'Ativo', sessions: 5, lastSession: '18 Fev 2024' },
        { id: '4', name: 'Ana Oliveira', email: 'ana@email.com', phone: '(11) 95555-4444', status: 'Ativo', sessions: 8, lastSession: '10 Fev 2024' },
        { id: '5', name: 'Carlos Lima', email: 'carlos@email.com', phone: '(11) 94444-3333', status: 'Inativo', sessions: 2, lastSession: '05 Jan 2024' },
    ]

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-neural-authority tracking-tight">
                        Gestão de <span className="text-neural-conversion underline decoration-neural-authority/10">Clientes</span>
                    </h1>
                    <p className="text-gray-400 font-medium mt-2 text-lg">
                        Visualize e gerencie todos os membros da sua plataforma premium.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-neural-authority hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 bg-neural-authority text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-neural-authority/20 hover:scale-[1.02] transition-all">
                        <UserPlus className="w-4 h-4" /> Novo Cliente
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-neural-authority transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou telefone..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-neural-authority/20 focus:ring-4 focus:ring-neural-authority/5 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 hover:text-neural-authority transition-all">
                        <Filter className="w-4 h-4" /> Filtros Avançados
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Cliente</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Contato</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Sessões</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Última Sessão</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-neural-authority text-white flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-110 transition-transform">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-neural-authority tracking-tight">{client.name}</p>
                                                <p className="text-[10px] font-bold text-neural-conversion uppercase tracking-widest mt-0.5">Membro ID: #{client.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                <Mail className="w-3 h-3" /> {client.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                                                <Phone className="w-3 h-3" /> {client.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-lg font-black text-neural-authority">{client.sessions}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm font-bold text-neural-authority/70">
                                            <Calendar className="w-3.5 h-3.5" /> {client.lastSession}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                            client.status === 'Ativo' && "bg-green-100 text-green-700",
                                            client.status === 'Pendente' && "bg-orange-100 text-orange-700",
                                            client.status === 'Inativo' && "bg-gray-100 text-gray-500"
                                        )}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-gray-300 hover:text-neural-authority hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                                            <MoreHorizontal className="w-6 h-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mostrando 5 de 124 clientes</p>
                    <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1 gap-1 shadow-sm">
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-neural-authority">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="px-4 text-xs font-black text-neural-authority">1 / 25</div>
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-neural-authority">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
