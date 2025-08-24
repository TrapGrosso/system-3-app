import * as React from "react"
import { Button } from "@/components/ui/button"
import { FailedOperationsTable } from "../components/activity-section/FailedOperationsTable"
import { RecentLogsList } from "../components/activity-section/RecentLogsList"
import { StatusSummaryBadges } from "../components/activity-section/StatusSummaryBadges"
import { ByActionChart } from "../components/activity-section/ByActionChart"

/**
 * ActivitySection - Recent activity logs, status summary, and failed operations
 */
export function ActivitySection({ data, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted/30 animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="h-32 bg-muted/30 animate-pulse rounded-lg" />
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

  const [showBreakdown, setShowBreakdown] = React.useState(false)

  const activity = data?.activity || {}
  const recentLogs = activity.recentLogs || {}

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recent Activity</h2>
      
      {/* Status Summary */}
      <StatusSummaryBadges byStatus={recentLogs.byStatus} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* By Action Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Activity by Action</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBreakdown((v) => !v)}
            >
              {showBreakdown ? "Show totals" : "Show breakdown"}
            </Button>
          </div>
          <ByActionChart byAction={recentLogs.byAction} breakdown={showBreakdown} />
        </div>

        {/* Recent Logs */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Operations</h3>
          <RecentLogsList logs={recentLogs.items} />
        </div>
      </div>

      {/* Failed Operations */}
      {recentLogs.failedOperations?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Failed Operations</h3>
          <FailedOperationsTable operations={recentLogs.failedOperations} />
        </div>
      )}
    </div>
  )
}
