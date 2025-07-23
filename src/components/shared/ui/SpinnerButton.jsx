import * as React from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/**
 * SpinnerButton - Button with integrated loading state management
 * Automatically handles disabled state, spinner positioning, and aria-busy
 */
function SpinnerButton({
  loading = false,
  disabled = false,
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
  ...props
}) {
  const isDisabled = loading || disabled

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      className={className}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Spinner 
          size={size === "sm" ? "sm" : "sm"} 
          className="mr-2" 
        />
      )}
      {children}
    </Button>
  )
}

export default SpinnerButton
