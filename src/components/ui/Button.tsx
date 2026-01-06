import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"

    const variants = {
      primary: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-orange-600 hover:to-amber-600",
      secondary: "bg-slate-700 text-white hover:bg-slate-600 shadow-lg shadow-slate-900/50",
      outline: "border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 hover:text-white",
      ghost: "text-slate-400 hover:bg-slate-800 hover:text-white",
    }

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-13 px-8 text-lg",
    }

    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"
