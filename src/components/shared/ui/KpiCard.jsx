import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MiniAreaChart, formatNumber } from "./ChartKit"

/**
 * KpiCard - Reusable KPI card with value, delta, and optional sparkline
 */
export function KpiCard({
  title,
  value,
  deltaPct,
  deltaDirection, // "up" | "down" | "neutral"
  helpText,
  subtext,
  icon: Icon,
  chartData,
  valueFormatter = formatNumber,
  className = "",
  ...props
}) {
  const getDeltaVariant = () => {
    if (!deltaPct || deltaDirection === "neutral") return "outline"
    return deltaDirection === "up" ? "default" : "destructive"
  }

  const getDeltaIcon = () => {
    if (!deltaPct || deltaDirection === "neutral") return Minus
    return deltaDirection === "up" ? TrendingUp : TrendingDown
  }

  const DeltaIcon = getDeltaIcon()

  return (
    <Card className={`@container/kpi ${className}`} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-sm font-medium">
          {helpText ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help border-b border-dotted">
                  {title}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{helpText}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            title
          )}
        </CardDescription>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold tabular-nums @[250px]/kpi:text-3xl">
              {valueFormatter(value)}
            </div>
            {deltaPct && (
              <Badge variant={getDeltaVariant()} className="text-xs">
                <DeltaIcon className="mr-1 h-3 w-3" />
                {Math.abs(deltaPct).toFixed(1)}%
              </Badge>
            )}
            {subtext && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtext}
              </p>
            )}
          </div>
          {chartData && chartData.length > 0 && (
            <div className="w-16 @[300px]/kpi:w-20">
              <MiniAreaChart
                data={chartData}
                height={40}
                colorVar={deltaDirection === "down" ? "destructive" : "primary"}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * KpiGrid - Responsive grid for KPI cards
 */
export function KpiGrid({ children, className = "", ...props }) {
  return (
    <div 
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
