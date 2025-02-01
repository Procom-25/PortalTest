import React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends ButtonProps {
  gradientFrom?: string
  gradientTo?: string
  hoverGradientFrom?: string
  hoverGradientTo?: string
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientFrom, gradientTo, hoverGradientFrom, hoverGradientTo, ...props }, ref) => {
    const gradientClasses = cn(
      "bg-gradient-to-r transition-all duration-300",
      gradientFrom || "from-blue-500",
      gradientTo || "to-purple-500",
      "hover:from-blue-600 hover:to-purple-600",
      className,
    )

    const hoverClasses =
      hoverGradientFrom && hoverGradientTo ? `hover:from-${hoverGradientFrom} hover:to-${hoverGradientTo}` : ""

    return <Button className={cn(gradientClasses, hoverClasses)} ref={ref} {...props} />
  },
)

GradientButton.displayName = "GradientButton"

