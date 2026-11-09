import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "neutral" | "destructive" | "outline" | "amber" | "success"
}

function Badge({
  className,
  variant = "secondary",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-[#111111] text-white border-transparent",
    secondary: "bg-[#F5F5F5] text-[#333333] border border-[#E5E5E5]",
    neutral: "bg-[#F5F5F5] text-[#333333] border border-[#E5E5E5]",
    outline: "text-[#111111] border border-[#E5E5E5] bg-white",
    destructive: "bg-rose-50 text-rose-700 border border-rose-200",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    amber: "bg-[#FAFAFA] text-[#333333] border border-[#E5E5E5]", // subtle monochrome fallback
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
