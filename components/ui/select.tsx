import * as React from "react"
import { cn } from "@/lib/utils"
import { LuChevronDown } from "react-icons/lu"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2 pr-9 text-sm text-[#111111] transition-colors focus-visible:outline-none focus-visible:border-[#111111] focus-visible:ring-1 focus-visible:ring-[#111111] disabled:cursor-not-allowed disabled:bg-[#F9F9F9] disabled:text-[#888888] disabled:border-[#EAEAEA] cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#777777]">
          <LuChevronDown className="w-4 h-4" />
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
