import * as React from "react"
import { Search, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/table/DataTable"
import { DonutChart, formatNumber } from "@/components/shared/ui/ChartKit"
import { KpiCard } from "@/components/shared/ui/KpiCard"

/**
 * QueuesSection - Deep search queue overview with donut chart and table breakdown
 */
export function QueuesSection({ data, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted/30 animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
          <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  const queues = data?.queues || {}
  const deepSearch = queues.deepSearch || {}

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Queues</h2>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Queue Overview KPI */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Deep Search Queue</h3>
          <DeepSearchOverview deepSearch={deepSearch} />
        </div>

        {/* Queue Distribution Chart */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Queue by Prompt</h3>
          <QueueDistributionChart byPrompt={deepSearch.byPrompt} total={deepSearch.total} />
        </div>

        {/* Queue Breakdown Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Prompt Breakdown</h3>
          <QueueBreakdownTable byPrompt={deepSearch.byPrompt} />
        </div>
      </div>
    </div>
  )
}

/**
 * DeepSearchOverview - KPI card showing total queue size
 */
function DeepSearchOverview({ deepSearch }) {
  const total = deepSearch.total || 0
  
  return (
    <KpiCard
      title="Items in Queue"
      value={total}
      icon={Search}
      helpText="Total number of items waiting to be processed in the deep search queue"
      subtext="Pending enrichment"
      valueFormatter={formatNumber}
      deltaDirection={total > 0 ? "neutral" : "neutral"}
    />
  )
}

/**
 * QueueDistributionChart - Donut chart showing distribution by prompt
 */
function QueueDistributionChart({ byPrompt = [], total = 0 }) {
  if (!byPrompt.length || total === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No queue data available</p>
        </CardContent>
      </Card>
    )
  }

  // Prepare chart data
  const chartData = byPrompt.map((item, index) => ({
    name: item.prompt_name || "Unknown Prompt",
    value: item.count || 0,
  }))

  // Generate colors for different prompts
  const colors = chartData.map((_, index) => 
    `hsl(${(index * 137.5) % 360}, 50%, 50%)`
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <DonutChart
          data={chartData}
          nameKey="name"
          valueKey="value"
          colors={colors}
          centerText={formatNumber(total)}
          centerSubtext="Total"
          showLegend={true}
          height={250}
        />
      </CardContent>
    </Card>
  )
}

/**
 * QueueBreakdownTable - Table showing queue items by prompt
 */
function QueueBreakdownTable({ byPrompt = [] }) {
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
      accessorKey: "count",
      header: "Queue Count",
      cell: ({ row }) => {
        const count = row.original.count || 0
        return (
          <Badge variant="outline" className="font-mono">
            {formatNumber(count)}
          </Badge>
        )
      },
    },
  ]

  const rowActions = (promptItem) => [
    {
      label: "View Queue Items",
      onSelect: () => {
        // Navigate to deep search queue filtered by prompt_id
        console.log("Navigate to queue filtered by prompt:", promptItem.prompt_id)
      },
    },
    {
      label: "View Prompt Details",
      onSelect: () => {
        // Navigate to prompts page filtered by prompt_id
        console.log("Navigate to prompt details:", promptItem.prompt_id)
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={byPrompt}
      enableSelection={false}
      rowActions={rowActions}
      emptyMessage="No queue data by prompt available"
      rowId={(row) => row.prompt_id || row.prompt_name}
    />
  )
}
