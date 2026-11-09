import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "amber"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 cursor-pointer active:scale-[0.99]"

    const variants = {
      default: "bg-[#111111] text-white hover:bg-[#262626] border border-[#111111] shadow-xs",
      destructive: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50/60 hover:border-rose-300",
      outline: "border border-[#E5E5E5] bg-white hover:bg-[#F7F7F7] text-[#111111] shadow-xs",
      secondary: "bg-[#F7F7F7] text-[#111111] hover:bg-[#EFEFEF] border border-[#E5E5E5]",
      ghost: "text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7]",
      link: "text-[#111111] underline-offset-4 hover:underline p-0 h-auto",
      amber: "bg-[#111111] text-white hover:bg-[#262626] border border-[#111111]", // aliased to clean primary
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8.5 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-6 text-base",
      icon: "h-9 w-9 p-0",
    }

    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
