"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:rounded-lg group-[.toaster]:border group-[.toaster]:shadow-lg group-[.toaster]:py-3 group-[.toaster]:px-4 group-[.toaster]:gap-3",
          description: "group-[.toast]:text-sm group-[.toast]:opacity-90",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm",
          success: "group-[.toaster]:bg-success-50 group-[.toaster]:text-success-900 group-[.toaster]:border-success-200 dark:group-[.toaster]:bg-success-950 dark:group-[.toaster]:text-success-100 dark:group-[.toaster]:border-success-800",
          error: "group-[.toaster]:bg-error-50 group-[.toaster]:text-error-900 group-[.toaster]:border-error-200 dark:group-[.toaster]:bg-error-950 dark:group-[.toaster]:text-error-100 dark:group-[.toaster]:border-error-800",
          warning: "group-[.toaster]:bg-warning-50 group-[.toaster]:text-warning-900 group-[.toaster]:border-warning-200 dark:group-[.toaster]:bg-warning-950 dark:group-[.toaster]:text-warning-100 dark:group-[.toaster]:border-warning-800",
          info: "group-[.toaster]:bg-info-50 group-[.toaster]:text-info-900 group-[.toaster]:border-info-200 dark:group-[.toaster]:bg-info-950 dark:group-[.toaster]:text-info-100 dark:group-[.toaster]:border-info-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
