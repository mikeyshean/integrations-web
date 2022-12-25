"use client"
import { useToast } from '@/context/toast'
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
                        <div key={idx} className="text-blue-500 text-lg">
                            {integration.name}
                        </div>
                    )
                })
            }
        </div>
    )
}