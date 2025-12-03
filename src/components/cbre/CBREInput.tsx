import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/src/components/ui/input"

export interface CBREInputProps extends React.ComponentProps<"input"> {
    error?: boolean;
}

const CBREInput = React.forwardRef<HTMLInputElement, CBREInputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                className={cn(
                    "font-calibre rounded-none border-light-grey",
                    "hover:border-accent-green transition-colors",
                    "focus-visible:border-accent-green focus-visible:ring-accent-green/20 focus-visible:ring-[3px]",
                    error && "border-negative-red focus-visible:border-negative-red focus-visible:ring-negative-red/20",
                    className
                )}
                {...props}
            />
        )
    }
)
CBREInput.displayName = "CBREInput"

export { CBREInput }
