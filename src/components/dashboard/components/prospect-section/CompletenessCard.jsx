import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber, formatPercent } from "@/components/shared/ui/ChartKit"

/**
 * CompletenessCard - Individual data completeness card with progress bar
 */
export function CompletenessCard({ title, icon: Icon, description, data, total }) {
  const count = data?.count || 0
  const percentage = data?.pct || 0

  // Clamp percentage to [0, 1] range for safety
  const clampedPercentage = Math.max(0, Math.min(1, percentage))

  return (
    <Card className="@container/completeness">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold tabular-nums">
              {formatNumber(count)}
            </div>
            <div className="text-xs text-muted-foreground">
              out of {formatNumber(total)}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="text-sm font-medium tabular-nums">
              {formatPercent(clampedPercentage, 0)}
            </div>
            <div 
              className="relative h-2 w-24 @[200px]/completeness:w-28 rounded bg-muted"
              role="progressbar"
              aria-valuenow={clampedPercentage * 100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Completeness ${formatPercent(clampedPercentage, 0)}`}
            >
              <div 
                className="absolute left-0 top-0 h-full rounded bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${clampedPercentage * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">Missing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
