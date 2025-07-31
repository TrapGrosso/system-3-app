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
 * ActionDropdown - A highly customizable dropdown component for actions/menus
 * 
 * Supports two main usage patterns:
 * 1. Items array mode: Pass an array of action items for quick setup
 * 2. Custom children mode: Pass custom JSX for full control over dropdown content
 * 
 * @param {Array} items - Array of action items or "separator" strings (ignored if children provided)
 * @param {any} context - Optional context passed to onSelect callbacks
 * @param {Function} renderTrigger - Custom trigger render function, receives trigger props
 * @param {Object} triggerProps - Props for the default trigger button
 * @param {string} align - Dropdown content alignment ("start" | "center" | "end")
 * @param {string} side - Dropdown content side ("top" | "right" | "bottom" | "left")
 * @param {number} sideOffset - Offset from the trigger
 * @param {string} contentClassName - Additional classes for dropdown content
 * @param {React.ReactNode} children - Custom dropdown content (overrides items)
 * @param {Object} ...props - Additional props forwarded to DropdownMenu root
 * 
 * @example
 * // Items array mode
 * <ActionDropdown 
 *   items={[
 *     { label: "Edit", icon: EditIcon, onSelect: handleEdit },
 *     "separator",
 *     { label: "Delete", icon: TrashIcon, onSelect: handleDelete, variant: "destructive" }
 *   ]}
 * />
 * 
 * @example
 * // Custom trigger
 * <ActionDropdown 
 *   items={items}
 *   renderTrigger={(props) => <Button {...props}>Actions</Button>}
 * />
 * 
 * @example
 * // Custom children
 * <ActionDropdown>
 *   <DropdownMenuItem>Custom item 1</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem>Custom item 2</DropdownMenuItem>
 * </ActionDropdown>
 */
function ActionDropdown({
  items = [],
  context,
  renderTrigger,
  triggerProps = {},
  align = "end",
  side = "bottom",
  sideOffset = 4,
  contentClassName,
  children,
  ...props
}) {
  const {
    icon: TriggerIcon = MoreHorizontalIcon,
    variant = "ghost",
    size = "icon",
    className: triggerClassName,
    ...restTriggerProps
  } = triggerProps

  // Custom trigger handler
  const renderDropdownTrigger = () => {
    const triggerBaseProps = {
      onClick: (e) => e.stopPropagation(),
      ...restTriggerProps
    }

    if (renderTrigger) {
      return (
        <DropdownMenuTrigger asChild>
          {renderTrigger(triggerBaseProps)}
        </DropdownMenuTrigger>
      )
    }

    return (
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${size === "icon" ? "h-8 w-8 p-0" : ""} ${triggerClassName || ""}`}
          {...triggerBaseProps}
        >
          <span className="sr-only">Open menu</span>
          <TriggerIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
    )
  }

  // Content renderer
  const renderDropdownContent = () => {
    if (children) {
      return children
    }

    return items.map((item, index) => {
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
    })
  }

  return (
    <DropdownMenu {...props}>
      {renderDropdownTrigger()}
      <DropdownMenuContent 
        align={align} 
        side={side} 
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {renderDropdownContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ActionDropdown }
