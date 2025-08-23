import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DonutChart, formatNumber, formatPercent } from "@/components/shared/ui/ChartKit"

/**
 * CompletenessCard - Individual data completeness card with donut chart
 */
export function CompletenessCard({ title, icon: Icon, description, data, total }) {
  const count = data?.count || 0
  const percentage = data?.pct || 0

  // Prepare donut chart data
  const chartData = [
    {
      name: "Complete",
      value: count,
    },
    {
      name: "Missing",
      value: total - count,
    },
  ]

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--muted))",
  ]

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
          
          <div className="w-16 @[200px]/completeness:w-20">
            <DonutChart
              data={chartData}
              nameKey="name"
              valueKey="value"
              colors={colors}
              centerText={formatPercent(percentage, 0)}
              showLegend={false}
              height={64}
            />
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
