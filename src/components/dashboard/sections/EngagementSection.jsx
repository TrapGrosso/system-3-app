import * as React from "react"
import { MessageSquare, Zap, Search, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/table/DataTable"
import { StackedBarChart, formatNumber } from "@/components/shared/ui/ChartKit"
import { KpiCard, KpiGrid } from "@/components/shared/ui/KpiCard"
import { SingleSelect } from "@/components/shared/filter/SingleSelect"

/**
 * Helper function to normalize prompts data based on view mode
 */
function getPromptsByMode(prompts, mode, topN) {
  switch (mode) {
    case 'variables':
      return (prompts.byVariables || []).slice(0, topN).map(item => ({
        prompt_id: item.prompt_id,
        prompt_name: item.prompt_name,
        variables: item.count || 0,
        enrichment: 0,
        totalUsage: item.count || 0
      }))
    
    case 'enrichment':
      return (prompts.byEnrichment || prompts.byDeepSearch || []).slice(0, topN).map(item => ({
        prompt_id: item.prompt_id,
        prompt_name: item.prompt_name,
        variables: 0,
        enrichment: item.count || 0,
        totalUsage: item.count || 0
      }))
    
    case 'both':
    default:
      // Prefer prompts.top if available, otherwise merge byVariables and byEnrichment
      if (prompts.top && prompts.top.length > 0) {
        return prompts.top.slice(0, topN)
      }
      
      // Fallback: merge byVariables and byEnrichment
      const variablesMap = new Map()
      const enrichmentMap = new Map()
      
      ;(prompts.byVariables || []).forEach(item => {
        const key = item.prompt_id || item.prompt_name
        if (key) variablesMap.set(key, item)
      })
      
      ;(prompts.byEnrichment || prompts.byDeepSearch || []).forEach(item => {
        const key = item.prompt_id || item.prompt_name
        if (key) enrichmentMap.set(key, item)
      })
      
      const allKeys = new Set([...variablesMap.keys(), ...enrichmentMap.keys()])
      const merged = Array.from(allKeys).map(key => {
        const varItem = variablesMap.get(key)
        const enrichItem = enrichmentMap.get(key)
        const variables = varItem?.count || 0
        const enrichment = enrichItem?.count || 0
        
        return {
          prompt_id: varItem?.prompt_id || enrichItem?.prompt_id,
          prompt_name: varItem?.prompt_name || enrichItem?.prompt_name,
          variables,
          enrichment,
          totalUsage: variables + enrichment
        }
      })
      
      return merged
        .sort((a, b) => b.totalUsage - a.totalUsage)
        .slice(0, topN)
  }
}

/**
 * EngagementSection - Prompts usage overview with KPIs, stacked chart, and top prompts table
 */
export function EngagementSection({ data, isLoading = false }) {
  const [viewMode, setViewMode] = React.useState('both')
  
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
  const topN = data?.meta?.topN || 5

  // Normalize prompts data based on selected view mode
  const normalizedPrompts = React.useMemo(() => 
    getPromptsByMode(prompts, viewMode, topN), 
    [prompts, viewMode, topN]
  )

  const viewOptions = [
    { value: 'both', label: 'Combined' },
    { value: 'variables', label: 'Variables only' },
    { value: 'enrichment', label: 'Enrichments only' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Prompts Usage</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View:</span>
          <SingleSelect
            value={viewMode}
            onValueChange={setViewMode}
            options={viewOptions}
            triggerClassName="h-8 min-w-[140px]"
          />
        </div>
      </div>
      
      {/* Usage KPIs */}
      <PromptsUsageKpis prompts={prompts} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Prompts Chart */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Top Prompts Usage</h3>
          <TopPromptsChart prompts={normalizedPrompts} mode={viewMode} />
        </div>

        {/* Top Prompts Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Prompt Details</h3>
          <TopPromptsTable prompts={normalizedPrompts} mode={viewMode} />
        </div>
      </div>
    </div>
  )
}

/**
 * PromptsUsageKpis - KPI cards showing total variable and enrichment usage
 */
function PromptsUsageKpis({ prompts }) {
  // Calculate totals from byVariables and byEnrichment arrays
  const totalVariables = (prompts.byVariables || []).reduce((sum, item) => sum + (item.count || 0), 0)
  const totalEnrichment = (prompts.byEnrichment || prompts.byDeepSearch || []).reduce((sum, item) => sum + (item.count || 0), 0)
  const totalUsage = totalVariables + totalEnrichment

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
        title="Enrichments"
        value={totalEnrichment}
        icon={Search}
        helpText="Total prompts used for enrichment operations"
        subtext="Enrichment prompts"
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
 * TopPromptsChart - Stacked bar chart showing variables vs enrichment usage by prompt
 */
function TopPromptsChart({ prompts = [], mode = 'both' }) {
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
    enrichment: prompt.enrichment || prompt.deepSearch || 0, // Fallback for old data
  }))

  // Define series based on mode with explicit HSL colors
  const series = React.useMemo(() => {
    const variablesSeries = {
      key: "variables",
      label: "Variables",
      color: "hsl(221 83% 53%)", // Blue
    }
    
    const enrichmentSeries = {
      key: "enrichment", 
      label: "Enrichments",
      color: "hsl(12 86% 57%)", // Orange
    }

    switch (mode) {
      case 'variables':
        return [variablesSeries]
      case 'enrichment':
        return [enrichmentSeries]
      case 'both':
      default:
        return [variablesSeries, enrichmentSeries]
    }
  }, [mode])

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
 * TopPromptsTable - Table of top prompts with usage metrics based on mode
 */
function TopPromptsTable({ prompts = [], mode = 'both' }) {
  const columns = React.useMemo(() => {
    const promptNameColumn = {
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
    }

    const variablesColumn = {
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
    }

    const enrichmentColumn = {
      accessorKey: "enrichment",
      header: "Enrichments",
      cell: ({ row }) => {
        const count = row.original.enrichment || row.original.deepSearch || 0 // Fallback for old data
        return (
          <div className="flex items-center gap-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline" className="font-mono">
              {formatNumber(count)}
            </Badge>
          </div>
        )
      },
    }

    const totalUsageColumn = {
      accessorKey: "totalUsage",
      header: "Total Usage",
      cell: ({ row }) => {
        const variables = row.original.variables || 0
        const enrichment = row.original.enrichment || row.original.deepSearch || 0
        const total = row.original.totalUsage || (variables + enrichment) // Fallback for old data
        return (
          <Badge variant="default" className="font-mono">
            {formatNumber(total)}
          </Badge>
        )
      },
    }

    // Return different column sets based on mode
    switch (mode) {
      case 'variables':
        return [promptNameColumn, variablesColumn]
      case 'enrichment':
        return [promptNameColumn, enrichmentColumn]
      case 'both':
      default:
        return [promptNameColumn, variablesColumn, enrichmentColumn, totalUsageColumn]
    }
  }, [mode])

  return (
    <DataTable
      columns={columns}
      data={prompts}
      enableSelection={false}
      emptyMessage="No prompt usage data available"
      rowId={(row) => row.prompt_id || row.prompt_name}
    />
  )
}
