import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

/**
 * Reusable table bulk actions dropdown component
 * 
 * @param {Object} props
 * @param {Array} props.actions - Array of action items or "separator" strings
 *   Action items: { id?, label, value, icon?, variant?, disabled?, onSelect? }
 * @param {Array} props.selectedIds - Array of selected item IDs
 * @param {Function} props.onAction - Global callback: (value, selectedIds) => void
 * @param {Object} props.buttonProps - Props forwarded to the trigger button
 * @param {Object} props.dropdownProps - Props forwarded to the dropdown menu
 * @param {string} props.className - Additional CSS classes
 */
function TableBulkActions({
  actions = [],
  selectedIds = [],
  onAction,
  buttonProps = {},
  dropdownProps = {},
  className,
  ...props
}) {
  const selectedCount = selectedIds.length
  const isDisabled = selectedCount === 0

  const handleItemClick = React.useCallback((item) => {
    if (item.disabled || isDisabled) return

    // Call individual item handler if provided
    if (item.onSelect) {
      item.onSelect(selectedIds)
    }

    // Call global action handler if provided
    if (onAction) {
      onAction(item.value, selectedIds)
    }
  }, [selectedIds, onAction, isDisabled])

  // Don't render if no actions provided
  if (!actions.length) {
    return null
  }

  const {
    variant = "outline",
    size = "sm",
    className: buttonClassName,
    ...restButtonProps
  } = buttonProps

  return (
    <div className={cn("flex justify-end", className)} {...props}>
      <DropdownMenu {...dropdownProps}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={isDisabled}
            className={cn(buttonClassName)}
            {...restButtonProps}
          >
            Selected ({selectedCount})
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => {
            // Handle separator
            if (action === "separator") {
              return <DropdownMenuSeparator key={`separator-${index}`} />
            }

            // Handle action item
            const {
              id = action.value || index,
              label,
              icon: ItemIcon,
              variant: itemVariant = "default",
              disabled: itemDisabled = false,
            } = action

            const isItemDisabled = isDisabled || itemDisabled

            return (
              <DropdownMenuItem
                key={id}
                variant={itemVariant}
                disabled={isItemDisabled}
                onClick={() => !isItemDisabled && handleItemClick(action)}
              >
                {ItemIcon && <ItemIcon className="h-4 w-4 mr-2" />}
                {label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { TableBulkActions }
