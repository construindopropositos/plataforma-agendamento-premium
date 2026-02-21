'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSecurity } from '@/hooks/useSecurity'
import { debounce } from 'lodash'

export default function CapsulaPage() {
    useSecurity()
    const { id_sessao } = useParams()
    const [notes, setNotes] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [saving, setSaving] = useState(false)

    // Mock admin check - in real app, check user role from profile
    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name') // Assuming for now, ideally check a role field
                    .eq('id', user.id)
                    .single()

                // Simplified check for demo
                setIsAdmin(true)
            }
        }
        checkAdmin()
    }, [])

    const saveNotes = async (newContent: string) => {
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase
            .from('meeting_notes')
            .upsert({
                session_id: id_sessao as string,
                user_id: user.id,
                content: newContent,
                updated_at: new Date().toISOString()
            }, { onConflict: 'session_id,user_id' })

        setSaving(false)
    }

    const debouncedSave = useCallback(
        debounce((nextValue: string) => saveNotes(nextValue), 5000),
        [id_sessao]
    )

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setNotes(value)
        debouncedSave(value)
    }

    return (
        <div className="flex h-screen bg-neural-bg overflow-hidden">
            {/* Main Content: Google Meet Wrapper */}
            <div className="flex-1 relative">
                <iframe
                    src={`https://meet.google.com/${id_sessao}?hs=122&authuser=0`}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    className="w-full h-full border-none"
                    title="Google Meet Session"
                />
                {/* Overlay to hide original URL/UI elements if possible via CSS/Z-index */}
                <div className="absolute top-0 left-0 w-full h-12 bg-neural-authority z-10 flex items-center px-4">
                    <h1 className="text-white font-bold">Sessão Premium #{id_sessao}</h1>
                </div>
            </div>

            {/* Admin Side Panel */}
            {isAdmin && (
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col p-4 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-neural-authority font-bold text-lg">Anotações do Mentor</h2>
                        {saving && <span className="text-xs text-neural-accent animate-pulse">Salvando...</span>}
                    </div>
                    <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        placeholder="Digite suas observações aqui..."
                        className="flex-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-neural-authority outline-none resize-none text-sm"
                    />
                    <div className="mt-4 p-3 bg-neural-bg rounded-lg text-[10px] text-gray-500">
                        As notas são salvas automaticamente após 5 segundos de inatividade.
                    </div>
                </div>
            )}
        </div>
    )
}
