import * as React from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Reusable table actions dropdown component
 * 
 * @param {Array} items - Array of action items or "separator" strings
 * @param {any} context - Optional context passed to onSelect callbacks
 * @param {Object} triggerProps - Optional trigger customization
 * @param {Object} ...props - Additional props forwarded to DropdownMenu
 */
function TableActionsDropdown({
  items = [],
  context,
  triggerProps = {},
  ...props
}) {
  const {
    icon: TriggerIcon = MoreHorizontalIcon,
    variant = "ghost",
    className: triggerClassName,
    ...restTriggerProps
  } = triggerProps

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={`h-8 w-8 p-0 ${triggerClassName || ''}`}
          onClick={(e) => e.stopPropagation()}
          {...restTriggerProps}
        >
          <span className="sr-only">Open menu</span>
          <TriggerIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item, index) => {
          // Handle separator
          if (item === "separator") {
            return <DropdownMenuSeparator key={`separator-${index}`} />
          }

          // Handle action item
          const {
            id = index,
            label,
            onSelect,
            icon: ItemIcon,
            variant: itemVariant = "default",
            disabled = false
          } = item

          return (
            <DropdownMenuItem
              key={id}
              variant={itemVariant}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                if (onSelect && !disabled) {
                  onSelect(context)
                }
              }}
            >
              {ItemIcon && <ItemIcon className="h-4 w-4 mr-2" />}
              {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { TableActionsDropdown }
