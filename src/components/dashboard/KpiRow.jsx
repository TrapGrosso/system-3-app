import * as React from "react"
import { Target, Users, AlertTriangle, Search } from "lucide-react"
import { KpiCard, KpiGrid } from "@/components/shared/ui/KpiCard"
import { formatNumber } from "@/components/shared/ui/ChartKit"

/**
 * KpiRow - Top-level summary metrics for the dashboard
 */
export function KpiRow({ data, isLoading = false }) {
  if (isLoading) {
    return (
      <KpiGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted/30 animate-pulse rounded-lg" />
        ))}
      </KpiGrid>
    )
  }

  if (!data) {
    return null
  }

  const runningCampaigns = data.campaigns?.running?.length || 0
  const newProspects = data.prospects?.newlyAdded?.count || 0
  const overdueTasks = data.tasks?.overdue?.length || 0
  const deepSearchQueue = data.queues?.deepSearch?.total || 0

  return (
    <KpiGrid>
      <KpiCard
        title="Running Campaigns"
        value={runningCampaigns}
        icon={Target}
        helpText="Number of active campaigns currently running"
        subtext="Active campaigns"
        valueFormatter={formatNumber}
      />
      
      <KpiCard
        title="New Prospects"
        value={newProspects}
        icon={Users}
        helpText={`Prospects added in the last ${data.meta?.lookbackDays || 7} days`}
        subtext={`Last ${data.meta?.lookbackDays || 7} days`}
        valueFormatter={formatNumber}
      />
      
      <KpiCard
        title="Tasks Overdue"
        value={overdueTasks}
        icon={AlertTriangle}
        helpText="Tasks that are past their due date"
        subtext="Requires attention"
        valueFormatter={formatNumber}
        deltaDirection={overdueTasks > 0 ? "down" : "neutral"}
      />
      
      <KpiCard
        title="Deep Search Queue"
        value={deepSearchQueue}
        icon={Search}
        helpText="Items waiting to be processed in the deep search queue"
        subtext="Pending enrichment"
        valueFormatter={formatNumber}
      />
    </KpiGrid>
  )
}
