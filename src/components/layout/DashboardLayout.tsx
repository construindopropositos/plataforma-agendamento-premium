'use client'

import Sidebar from './Sidebar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
