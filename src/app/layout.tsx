"use client"
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext';


export default function RootLayout({children}: {
    children: React.ReactNode;
}) {

    return (
        <html className="h-full bg-white">
            <body className="h-full overflow-hidden">
                <AuthProvider>
                    <Navbar />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}