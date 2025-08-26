import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

/**
 * LinkButton - A reusable component that combines Button with Link using asChild
 * Provides consistent styling for navigation actions throughout the app
 * 
 * @param {string} to - The route to navigate to (required)
 * @param {string} variant - Button variant ("default" | "outline" | "ghost" | "link")
 * @param {string} size - Button size ("default" | "sm" | "lg" | "icon")
 * @param {React.ReactNode} icon - Optional icon to display before text
 * @param {React.ReactNode} children - Button content/text
 * @param {string} className - Additional CSS classes
 * @param {Object} ...props - Additional props forwarded to Button
 * 
 * @example
 * // Primary navigation action
 * <LinkButton to="/login" variant="default">
 *   Go to login
 * </LinkButton>
 * 
 * @example
 * // Secondary/back navigation with icon
 * <LinkButton to="/login" variant="ghost" size="sm" icon={<ArrowLeftIcon className="size-4" />}>
 *   Back to login
 * </LinkButton>
 * 
 * @example
 * // Outline button for secondary actions
 * <LinkButton to="/forgot-password" variant="outline">
 *   Request new reset link
 * </LinkButton>
 */
function LinkButton({
  to,
  variant = "default",
  size = "default",
  icon,
  children,
  className,
  ...props
}) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      <Link to={to}>
        {icon && icon}
        {children}
      </Link>
    </Button>
  )
}

export { LinkButton }
