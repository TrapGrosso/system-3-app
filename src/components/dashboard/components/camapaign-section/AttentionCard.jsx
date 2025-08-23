import * as React from "react"
import { TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


/**
 * AttentionCard - Individual attention item card with collapsible details
 */
export function AttentionCard({ title, count, items, variant, icon: Icon }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
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
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto">
                <span className="text-xs text-muted-foreground">
                  {isOpen ? "Hide" : "Show"} details
                </span>
                <TrendingDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-1">
                {items.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-xs text-muted-foreground truncate">
                    {typeof item === "string" ? item : item.name || item.id || "Unknown"}
                  </div>
                ))}
                {items.length > 5 && (
                  <div className="text-xs text-muted-foreground">
                    +{items.length - 5} more
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}
    </Card>
  )
}
