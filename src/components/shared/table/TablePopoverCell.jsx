import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const triggerVariants = {
  blue: "text-blue-600 hover:text-blue-800",
  green: "text-green-600 hover:text-green-800", 
  slate: "text-foreground hover:text-foreground/80",
  accent: "text-accent-foreground hover:text-accent-foreground/80"
}

function TablePopoverCell({
  items,
  title,
  icon,
  triggerVariant = "slate",
  maxHeight = 240,
  renderItem,
  popoverProps = {},
  className,
  ...props
}) {
  // If no items, show dash
  if (!items?.length) {
    return <div className="text-center text-muted-foreground">—</div>
  }

  // Default render function
  const defaultRenderItem = React.useCallback((item) => (
    <div className="p-2 border rounded-md text-sm">
      <p className="text-foreground">{String(item)}</p>
    </div>
  ), [])

  const itemRenderer = renderItem || defaultRenderItem

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-auto p-1",
            triggerVariants[triggerVariant],
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-1" })}
          {items.length}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 max-w-[90vw]" 
        align="start"
        {...popoverProps}
      >
        <div className="space-y-2">
          {title && <h4 className="font-medium text-sm">{title}</h4>}
          <div 
            className="space-y-2 overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.id || index}>
                {itemRenderer(item, index)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { TablePopoverCell }
