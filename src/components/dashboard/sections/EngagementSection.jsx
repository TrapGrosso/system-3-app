import * as React from "react"
import { MessageSquare, Zap, Search, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/table/DataTable"
import { StackedBarChart, formatNumber } from "@/components/shared/ui/ChartKit"
import { KpiCard, KpiGrid } from "@/components/shared/ui/KpiCard"

/**
 * EngagementSection - Prompts usage overview with KPIs, stacked chart, and top prompts table
 */
export function EngagementSection({ data, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted/30 animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-32 bg-muted/30 animate-pulse rounded-lg" />
          <div className="h-32 bg-muted/30 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
          <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  const engagement = data?.engagement || {}
  const prompts = engagement.prompts || {}

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Engagement & Prompts</h2>
      
      {/* Usage KPIs */}
      <PromptsUsageKpis prompts={prompts} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Prompts Chart */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Top Prompts Usage</h3>
          <TopPromptsChart prompts={prompts.top} />
        </div>

        {/* Top Prompts Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Prompt Details</h3>
          <TopPromptsTable prompts={prompts.top} />
        </div>
      </div>
    </div>
  )
}

/**
 * PromptsUsageKpis - KPI cards showing total variable and deepSearch usage
 */
function PromptsUsageKpis({ prompts }) {
  // Calculate totals from byVariables and byDeepSearch arrays
  const totalVariables = (prompts.byVariables || []).reduce((sum, item) => sum + (item.count || 0), 0)
  const totalDeepSearch = (prompts.byDeepSearch || []).reduce((sum, item) => sum + (item.count || 0), 0)
  const totalUsage = totalVariables + totalDeepSearch

  return (
    <KpiGrid>
      <KpiCard
        title="Variable Generation"
        value={totalVariables}
        icon={Zap}
        helpText="Total prompts used for variable generation"
        subtext="Variable prompts"
        valueFormatter={formatNumber}
      />
      
      <KpiCard
        title="Deep Search"
        value={totalDeepSearch}
        icon={Search}
        helpText="Total prompts used for deep search operations"
        subtext="Search prompts"
        valueFormatter={formatNumber}
      />
      
      <KpiCard
        title="Total Usage"
        value={totalUsage}
        icon={MessageSquare}
        helpText="Combined usage across all prompt types"
        subtext="All prompts"
        valueFormatter={formatNumber}
      />

      <KpiCard
        title="Active Prompts"
        value={(prompts.top || []).length}
        icon={TrendingUp}
        helpText="Number of prompts with recent activity"
        subtext="Currently used"
        valueFormatter={formatNumber}
      />
    </KpiGrid>
  )
}

/**
 * TopPromptsChart - Stacked bar chart showing variables vs deepSearch usage by prompt
 */
function TopPromptsChart({ prompts = [] }) {
  if (!prompts.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No prompt usage data available</p>
        </CardContent>
      </Card>
    )
  }

  // Transform data for stacked bar chart
  const chartData = prompts.map((prompt) => ({
    name: prompt.prompt_name || "Unknown Prompt",
    variables: prompt.variables || 0,
    deepSearch: prompt.deepSearch || 0,
  }))

  const series = [
    {
      key: "variables",
      label: "Variables",
      colorVar: "primary",
    },
    {
      key: "deepSearch", 
      label: "Deep Search",
      colorVar: "secondary",
    },
  ]

  return (
    <Card>
      <CardContent className="pt-6">
        <StackedBarChart
          data={chartData}
          xKey="name"
          series={series}
          height={Math.max(300, chartData.length * 50)}
        />
      </CardContent>
    </Card>
  )
}

/**
 * TopPromptsTable - Table of top prompts with all usage metrics
 */
function TopPromptsTable({ prompts = [] }) {
  const columns = [
    {
      accessorKey: "prompt_name",
      header: "Prompt Name",
      cell: ({ row }) => {
        const promptName = row.original.prompt_name || "Unknown Prompt"
        return (
          <div className="space-y-1">
            <div className="font-medium">{promptName}</div>
            {row.original.prompt_id && (
              <div className="text-xs text-muted-foreground font-mono">
                {row.original.prompt_id.slice(0, 8)}...
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "variables",
      header: "Variables",
      cell: ({ row }) => {
        const count = row.original.variables || 0
        return (
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline" className="font-mono">
              {formatNumber(count)}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "deepSearch",
      header: "Deep Search",
      cell: ({ row }) => {
        const count = row.original.deepSearch || 0
        return (
          <div className="flex items-center gap-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline" className="font-mono">
              {formatNumber(count)}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "totalUsage",
      header: "Total Usage",
      cell: ({ row }) => {
        const total = row.original.totalUsage || 0
        return (
          <Badge variant="default" className="font-mono">
            {formatNumber(total)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "usage_ratio",
      header: "Usage Split",
      cell: ({ row }) => {
        const variables = row.original.variables || 0
        const deepSearch = row.original.deepSearch || 0
        const total = variables + deepSearch
        
        if (total === 0) return "-"
        
        const variablesPercent = Math.round((variables / total) * 100)
        const deepSearchPercent = 100 - variablesPercent
        
        return (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              {variablesPercent}% vars / {deepSearchPercent}% search
            </div>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="bg-primary transition-all" 
                style={{ width: `${variablesPercent}%` }}
              />
              <div 
                className="bg-secondary transition-all" 
                style={{ width: `${deepSearchPercent}%` }}
              />
            </div>
          </div>
        )
      },
    },
  ]

  const rowActions = (prompt) => [
    {
      label: "View Prompt Details",
      onSelect: () => {
        // Navigate to prompts page filtered by prompt_id
        console.log("Navigate to prompt details:", prompt.prompt_id)
      },
    },
    {
      label: "View Usage History",
      onSelect: () => {
        // Navigate to logs filtered by prompt usage
        console.log("View usage history for prompt:", prompt.prompt_id)
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={prompts}
      enableSelection={false}
      rowActions={rowActions}
      emptyMessage="No prompt usage data available"
      rowId={(row) => row.prompt_id || row.prompt_name}
    />
  )
}
