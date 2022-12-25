"use client"
import ToastContainer from '@/components/toast/ToastContainer'
import { ToastProvider } from '@/context/toast'
import { useState } from 'react';


export default function IntegrationsLayout({children}: {
    children: React.ReactNode;
}) {
    const [toasts] = useState([])

    return (
        <div>
            <ToastProvider>
                <div>{children}</div>
                <ToastContainer />
            </ToastProvider>
        </div>
    );
}