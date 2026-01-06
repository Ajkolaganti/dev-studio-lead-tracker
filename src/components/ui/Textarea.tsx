import { type TextareaHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 min-h-[100px] resize-y",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"
