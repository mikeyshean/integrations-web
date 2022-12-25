"use client"
import { Fragment, useContext, useEffect, useState } from 'react'
import { useToastContext } from '../../context/toast'
import Toast from './Toast'

export default function ToastContainer() {
  const toasts = useToastContext()

  return (
      <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {
            toasts && toasts.map((toast, idx) => {
              return <Toast key={idx} message={toast.message}/>
            })
          }
        </div>
      </div>
    </>
  )
}
