"use client"
import { useToast } from '@/context/ToastContext'
import useIntegrations from 'hooks/useIntegrations'
import Shell from '@/components/application/Shell';

export default function AppPage() {
    const addToast = useToast()
    const { integrations } = useIntegrations()

    function clickHandler() {
        addToast({
            message: "Hello"
        })
    }
    return (
        <Shell />
    )
}