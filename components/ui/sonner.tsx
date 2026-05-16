"use client"

import { AlertCircle, CheckCircle2, Info, Loader2, XCircle } from "lucide-react"
import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      icons={{
        success: <CheckCircle2 className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <AlertCircle className="h-4 w-4" />,
        error: <XCircle className="h-4 w-4" />,
        loading: <Loader2 className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "border border-white bg-black text-white shadow-xl shadow-black/30",
          title: "text-sm font-medium text-white",
          description: "text-white/80",
          icon: "text-white",
          actionButton: "rounded-full bg-white text-black",
          cancelButton: "rounded-full bg-neutral-900 text-white",
        },
      }}
    />
  )
}
