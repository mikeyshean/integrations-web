"use client"
import ToastContainer from '@/components/toast/ToastContainer'
import { ToastProvider } from '@/context/ToastContext'


export default function MapperLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            {children}
            {/* <ToastContainer /> */}
        </ToastProvider>
    );
}