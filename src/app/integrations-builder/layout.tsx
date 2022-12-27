"use client"
import ToastContainer from '@/components/toast/ToastContainer'
import { PrivateRoute } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext'


export default function IntegrationsLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        // <div>
        <PrivateRoute>
            <ToastProvider>
                <div>{children}</div>
                <ToastContainer />
            </ToastProvider>
        </PrivateRoute>
        // </div>
    );
}