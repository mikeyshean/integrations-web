"use client"
import React, { createContext, useContext, useState } from 'react';

type Toast = {
    message: string
}

const ToastContext = createContext<Toast[]>([]);
const AddToastContext = createContext(({}:Toast)=>{})

function useToastContext() {
    return useContext(ToastContext)
}

function useToast() {
    return useContext(AddToastContext)
}

function ToastProvider({children}: {
    children: React.ReactNode;
}) {
    const [toasts, setToastList] = useState<Toast[]>([]);

    function addToast(toast: Toast) {
        console.log(toast)
        setToastList([...toasts, toast])
    }
  
    return (
        <ToastContext.Provider value={ toasts }>
            <AddToastContext.Provider value={addToast}>
                {children}
            </AddToastContext.Provider>
        </ToastContext.Provider>
    );
  };
  
  export {ToastProvider, useToast, useToastContext}