"use client"
import { useToast } from '@/context/ToastContext'
import useIntegrations from 'hooks/useIntegrations'

export default function IntegrationsPage() {
    const addToast = useToast()
    const { integrations } = useIntegrations()

    function clickHandler() {
        addToast({
            message: "Hello"
        })
    }
    return (
        <div >
            <button onClick={clickHandler}>Add Toast</button>
            {
                integrations && integrations.map((integration, idx) => {
                    return (
                        <div key={idx} className="text-blue-500 text-3xl">
                            {integration.name}
                        </div>
                    )
                })
            }
        </div>
    )
}