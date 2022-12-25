"use client"
import { useToast } from '@/context/toast'

export default function IntegrationsPage() {
    const addToast = useToast()

    function clickHandler() {
        addToast({
            message: "Hello"
        })
    }
    return (
        <div >
            <button onClick={clickHandler}>Add Toast</button>
        </div>
    )
}