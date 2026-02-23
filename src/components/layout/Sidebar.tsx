'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getUserProfile } from '@/app/actions/auth'

export default function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const isAdmin = profile?.subscription_status === 'admin'

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile()
                setProfile(data)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Painel Geral', icon: LayoutDashboard },
        { href: '/admin/agenda', label: 'Minha Agenda', icon: Calendar },
        { href: '/admin/usuarios', label: 'Clientes', icon: Users },
        { href: '/admin/configuracoes', label: 'Ajustes', icon: Settings },
    ]

    const userLinks = [
        { href: '/capsula/dashboard', label: 'Minha Área', icon: LayoutDashboard },
        { href: '/capsula/agendar', label: 'Novo Agendamento', icon: Sparkles },
    ]

    const links = (isAdmin || pathname.startsWith('/admin')) ? adminLinks : userLinks

    const handleLogout = async () => {
        // Here you would call your logout action
        window.location.href = '/login'
    }

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Avoid hydration mismatch on initial render
    }

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-[60]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neural-authority rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6 text-neural-authority" /> : <Menu className="w-6 h-6 text-neural-authority" />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-neural-authority/20 backdrop-blur-sm z-[70] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Wrapper */}
            <aside
                className={cn(
                    "fixed md:sticky top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-[80]",
                    isCollapsed ? "w-24" : "w-[280px]",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-12 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md z-[90] hover:scale-110 transition-all text-gray-400 hover:text-neural-authority"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Logo Area */}
                <div className={cn(
                    "h-24 flex items-center px-6 transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-start"
                )}>
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neural-authority rounded-2xl flex items-center justify-center shadow-lg shadow-neural-authority/20 flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="animate-in fade-in duration-500">
                                <h2 className="text-sm font-black text-neural-authority leading-tight">AGENDAMENTO</h2>
                                <p className="text-[10px] font-bold text-neural-conversion uppercase tracking-widest mt-0.5">Premium SaaS</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar py-2">
                    {loading && !pathname.startsWith('/admin') && !pathname.startsWith('/capsula') ? (
                        <div className="space-y-3 px-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        links.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "relative group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                                        isCollapsed && "justify-center px-0",
                                        isActive
                                            ? "bg-neural-authority text-white shadow-lg shadow-neural-authority/20 font-bold"
                                            : "text-gray-400 hover:bg-gray-50 hover:text-neural-authority font-medium"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                                    {!isCollapsed && (
                                        <span className="text-sm whitespace-nowrap animate-in fade-in duration-300">
                                            {link.label}
                                        </span>
                                    )}

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-neural-authority text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl">
                                            {link.label}
                                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-neural-authority" />
                                        </div>
                                    )}
                                </Link>
                            )
                        })
                    )}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className={cn(
                        "flex items-center gap-3 p-2 transition-all",
                        isCollapsed ? "justify-center" : "bg-white rounded-2xl shadow-sm border border-gray-100"
                    )}>
                        <div className="w-9 h-9 rounded-xl bg-neural-authority text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                            {profile?.full_name?.charAt(0) || (pathname.startsWith('/admin') ? 'A' : 'U')}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <p className="text-xs font-black text-neural-authority truncate">
                                    {profile?.full_name || (pathname.startsWith('/admin') ? 'Administrador' : 'Usuário')}
                                </p>
                                <p className="text-[10px] font-bold text-neural-conversion uppercase tracking-tighter">
                                    {isAdmin || pathname.startsWith('/admin') ? 'Acesso Total' : 'Membro VIP'}
                                </p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button 
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}
