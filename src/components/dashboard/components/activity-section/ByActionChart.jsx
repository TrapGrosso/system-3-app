import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChartHorizontal, StackedBarChart, formatNumber } from "@/components/shared/ui/ChartKit"

/**
 * ByActionChart - Horizontal bar chart showing operations by action type
 */
export function ByActionChart({ byAction = [], breakdown = false }) {
  if (!byAction.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No activity data available</p>
        </CardContent>
      </Card>
    )
  }

  // Transform data for chart
  const chartData = byAction.map((item) => ({
    name: item.action?.replace(/_/g, " ") || "Unknown",
    value: (item.success || 0) + (item.failed || 0) + (item.in_progress || 0),
    success: item.success || 0,
    failed: item.failed || 0,
    in_progress: item.in_progress || 0,
  }))

  return (
    <Card>
      <CardContent className="pt-6">
        {breakdown ? (
          <StackedBarChart
            data={chartData}
            orientation="horizontal"
            categoryKey="name"
            series={[
              { key: "success", label: "Success", color: "hsl(142, 71%, 45%)" },      // green
              { key: "failed", label: "Failed", color: "hsl(0, 84%, 60%)" },           // red
              { key: "in_progress", label: "In progress", color: "hsl(217, 91%, 60%)" }, // blue
            ]}
            xNumberDomain={[0, "dataMax"]}
            xAllowDecimals={false}
            xTickFormatter={formatNumber}
            yAxisWidth={120}
            height={Math.max(200, chartData.length * 40)}
          />
        ) : (
          <BarChartHorizontal
            data={chartData}
            nameKey="name"
            valueKey="value"
            height={Math.max(200, chartData.length * 40)}
            colorVar="primary"
          />
        )}
      </CardContent>
    </Card>
  )
}