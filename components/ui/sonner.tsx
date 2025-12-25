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
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-success-50/90 group-[.toaster]:text-success-700 group-[.toaster]:border-success-200 dark:group-[.toaster]:bg-success-900/30 dark:group-[.toaster]:border-success-800 dark:group-[.toaster]:text-success-300 [&>svg]:text-success-600 dark:[&>svg]:text-success-400",
          error: "group-[.toaster]:bg-error-50/90 group-[.toaster]:text-error-700 group-[.toaster]:border-error-200 dark:group-[.toaster]:bg-error-900/30 dark:group-[.toaster]:border-error-800 dark:group-[.toaster]:text-error-300 [&>svg]:text-error-600 dark:[&>svg]:text-error-400",
          warning: "group-[.toaster]:bg-warning-50/90 group-[.toaster]:text-warning-700 group-[.toaster]:border-warning-200 dark:group-[.toaster]:bg-warning-900/30 dark:group-[.toaster]:border-warning-800 dark:group-[.toaster]:text-warning-300 [&>svg]:text-warning-600 dark:[&>svg]:text-warning-400",
          info: "group-[.toaster]:bg-info-50/90 group-[.toaster]:text-info-700 group-[.toaster]:border-info-200 dark:group-[.toaster]:bg-info-900/30 dark:group-[.toaster]:border-info-800 dark:group-[.toaster]:text-info-300 [&>svg]:text-info-600 dark:[&>svg]:text-info-400",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
