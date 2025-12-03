import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/src/components/ui/textarea"

export interface CBRETextareaProps extends React.ComponentProps<"textarea"> {
    error?: boolean;
}

const CBRETextarea = React.forwardRef<HTMLTextAreaElement, CBRETextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <Textarea
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
CBRETextarea.displayName = "CBRETextarea"

export { CBRETextarea }
