"use client"
import '../styles/globals.css'
import { AuthProvider } from '@/context/AuthContext';
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
  const queryClient = new QueryClient()

  return (
    <html className="h-full bg-white">
      <body className="h-full overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            {children}
        </AuthProvider>
      </QueryClientProvider>
      </body>
    </html>
  );
}