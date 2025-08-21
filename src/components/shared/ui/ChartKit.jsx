import * as React from "react"
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

/**
 * Shared chart abstraction to avoid using recharts primitives directly
 * All charts use shadcn/ui ChartContainer and consistent styling
 */

/**
 * MiniAreaChart - Small area sparkline with optional gradient
 */
export function MiniAreaChart({
  data = [],
  xKey = "x",
  yKey = "y",
  colorVar = "primary",
  height = 60,
  showAxis = false,
  className = "",
  ...props
}) {
  const chartConfig = {
    [yKey]: {
      label: yKey,
      color: `var(--color-${colorVar})`,
    },
  }

  if (!data.length) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted/30 rounded ${className}`}
        style={{ height }}
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={`w-full ${className}`} style={{ height }}>
      <AreaChart data={data} {...props}>
        <defs>
          <linearGradient id={`fill-${colorVar}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={`var(--color-${colorVar})`} stopOpacity={0.8} />
            <stop offset="95%" stopColor={`var(--color-${colorVar})`} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {showAxis && <CartesianGrid vertical={false} />}
        {showAxis && <XAxis dataKey={xKey} hide={!showAxis} />}
        {showAxis && <YAxis hide={!showAxis} />}
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey={yKey}
          type="monotone"
          fill={`url(#fill-${colorVar})`}
          stroke={`var(--color-${colorVar})`}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

/**
 * DonutChart - Radial/donut for composition with center text
 */
export function DonutChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  colors = ["hsl(var(--primary))", "hsl(var(--muted))"],
  centerText,
  centerSubtext,
  showLegend = true,
  height = 200,
  className = "",
  ...props
}) {
  const chartConfig = Object.fromEntries(
    data.map((item, index) => [
      item[nameKey],
      {
        label: item[nameKey],
        color: colors[index] || `hsl(${(index * 137.5) % 360}, 50%, 50%)`,
      },
    ])
  )

  if (!data.length) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted/30 rounded ${className}`}
        style={{ height }}
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={`w-full ${className}`} style={{ height }}>
      <PieChart {...props}>
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index] || `hsl(${(index * 137.5) % 360}, 50%, 50%)`} 
            />
          ))}
        </Pie>
        {(centerText || centerSubtext) && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground">
            <tspan x="50%" dy="-0.5em" className="text-lg font-bold">
              {centerText}
            </tspan>
            {centerSubtext && (
              <tspan x="50%" dy="1.2em" className="text-xs fill-muted-foreground">
                {centerSubtext}
              </tspan>
            )}
          </text>
        )}
      </PieChart>
    </ChartContainer>
  )
}

/**
 * BarChartHorizontal - Horizontal bars
 */
export function BarChartHorizontal({
  data = [],
  nameKey = "name",
  valueKey = "value",
  colorVar = "primary",
  height = 300,
  className = "",
  ...props
}) {
  const chartConfig = {
    [valueKey]: {
      label: valueKey,
      color: `var(--color-${colorVar})`,
    },
  }

  if (!data.length) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted/30 rounded ${className}`}
        style={{ height }}
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={`w-full ${className}`} style={{ height }}>
      <BarChart data={data} layout="horizontal" {...props}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey={nameKey} type="category" width={100} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={valueKey} fill={`var(--color-${colorVar})`} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

/**
 * StackedBarChart - Stacked usage
 */
export function StackedBarChart({
  data = [],
  xKey = "x",
  series = [], // [{ key, label, colorVar }]
  height = 300,
  className = "",
  ...props
}) {
  const chartConfig = Object.fromEntries(
    series.map(s => [
      s.key,
      {
        label: s.label,
        color: `var(--color-${s.colorVar})`,
      },
    ])
  )

  if (!data.length) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted/30 rounded ${className}`}
        style={{ height }}
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={`w-full ${className}`} style={{ height }}>
      <BarChart data={data} {...props}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((s) => (
          <Bar 
            key={s.key}
            dataKey={s.key} 
            stackId="stack"
            fill={`var(--color-${s.colorVar})`}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

// Utility functions for formatting
export const formatPercent = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%'
  return `${(value * 100).toFixed(decimals)}%`
}

export const formatNumber = (value) => {
  if (typeof value !== 'number') return '0'
  return value.toLocaleString()
}

export const formatRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hrs ago`
  } else {
    return `${diffInDays} days ago`
  }
}
