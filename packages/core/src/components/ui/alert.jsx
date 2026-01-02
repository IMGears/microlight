// @ts-check
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/utils/css/cn"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        destructive:
          "text-destructive bg-destructive/10 border-destructive/20 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90",
        warning:
          "text-amber-600 bg-amber-50 border-amber-200 [&>svg]:text-amber-600 *:data-[slot=alert-description]:text-amber-600/90 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-800/20 dark:[&>svg]:text-amber-400",
        success:
          "text-green-600 bg-green-50 border-green-200 [&>svg]:text-green-600 *:data-[slot=alert-description]:text-green-600/90 dark:text-green-400 dark:bg-green-950/20 dark:border-green-800/20 dark:[&>svg]:text-green-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * @param {{
 *   className?: string,
 *   variant?: 'default' | 'destructive' | 'warning' | 'success'
 * } & React.HTMLAttributes<HTMLDivElement>} props
 * @returns {React.JSX.Element}
 */
function Alert({
  className,
  variant,
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

/**
 * @param {{
 *   className?: string
 * } & React.HTMLAttributes<HTMLDivElement>} props
 * @returns {React.JSX.Element}
 */
function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

/**
 * @param {{
 *   className?: string
 * } & React.HTMLAttributes<HTMLDivElement>} props
 * @returns {React.JSX.Element}
 */
function AlertDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
