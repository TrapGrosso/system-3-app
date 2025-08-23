import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdvancedFiltersCollapsible from "@/components/shared/ui/AdvancedFiltersCollapsible"


/**
 * AttentionCard - Individual attention item card with collapsible details
 */
export function AttentionCard({
  title,
  count = 0,
  items = [],
  variant,
  icon: Icon,
  maxPreview = 5,
  renderItem
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  const label = `${isOpen ? "Hide" : "Show"} campaigns`

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
            <CardDescription className="text-sm font-medium">
              {title}
            </CardDescription>
          </div>
          <Badge variant={variant}>
            {count}
          </Badge>
        </div>
      </CardHeader>
      
      {count > 0 && (
        <CardContent className="pt-0">
          <AdvancedFiltersCollapsible
            label={label}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <div className="space-y-1">
              {items.slice(0, maxPreview).map((item, index) => {
                const naturalKey =
                  (typeof item === "object" && (item.id ?? item.key ?? item.name)) || undefined
                const key = naturalKey ?? index
                return (
                  <div key={key} className="text-xs text-muted-foreground truncate">
                    {renderItem
                      ? renderItem(item)
                      : typeof item === "string"
                        ? item
                        : item?.name || item?.id || "Unknown"}
                  </div>
                )
              })}
              {items.length > maxPreview && (
                <div className="text-xs text-muted-foreground">
                  +{items.length - maxPreview} more
                </div>
              )}
            </div>
          </AdvancedFiltersCollapsible>
        </CardContent>
      )}
    </Card>
  )
}
