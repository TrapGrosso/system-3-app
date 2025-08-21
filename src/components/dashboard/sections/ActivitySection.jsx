import * as React from "react"
import { CheckCircle, XCircle, Clock, Play, RotateCcw, User2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/table/DataTable"
import { BarChartHorizontal, formatNumber, formatRelativeTime } from "@/components/shared/ui/ChartKit"

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
          <h3 className="text-lg font-medium">Activity by Action</h3>
          <ByActionChart byAction={recentLogs.byAction} />
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

/**
 * StatusSummaryBadges - Three badges showing success, failed, in_progress counts
 */
function StatusSummaryBadges({ byStatus }) {
  const success = byStatus?.success || 0
  const failed = byStatus?.failed || 0
  const inProgress = byStatus?.in_progress || 0

  return (
    <div className="flex items-center gap-4">
      <Badge variant="default" className="gap-2 px-3 py-1.5">
        <CheckCircle className="h-4 w-4" />
        {formatNumber(success)} Successful
      </Badge>
      
      <Badge variant="destructive" className="gap-2 px-3 py-1.5">
        <XCircle className="h-4 w-4" />
        {formatNumber(failed)} Failed
      </Badge>
      
      <Badge variant="outline" className="gap-2 px-3 py-1.5">
        <Clock className="h-4 w-4" />
        {formatNumber(inProgress)} In Progress
      </Badge>
    </div>
  )
}

/**
 * ByActionChart - Horizontal bar chart showing operations by action type
 */
function ByActionChart({ byAction = [] }) {
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
        <BarChartHorizontal
          data={chartData}
          nameKey="name"
          valueKey="value"
          height={Math.max(200, chartData.length * 40)}
          colorVar="primary"
        />
      </CardContent>
    </Card>
  )
}

/**
 * RecentLogsList - List of recent log items
 */
function RecentLogsList({ logs = [] }) {
  if (!logs.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No recent operations</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {logs.map((log, index) => (
        <LogItem key={log.id || index} log={log} />
      ))}
    </div>
  )
}

/**
 * LogItem - Individual log entry card
 */
function LogItem({ log }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return CheckCircle
      case "failed":
        return XCircle
      case "in_progress":
        return Clock
      default:
        return Play
    }
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      case "in_progress":
        return "outline"
      default:
        return "secondary"
    }
  }

  const StatusIcon = getStatusIcon(log.status)
  const duration = log.start_time && log.end_time 
    ? Math.round((new Date(log.end_time) - new Date(log.start_time)) / 1000)
    : null

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(log.status)} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {log.action?.replace(/_/g, " ") || "Unknown"}
                </Badge>
                {duration && (
                  <span className="text-xs text-muted-foreground">
                    {duration}s
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatRelativeTime(log.start_time)}
              </div>
            </div>
          </div>

          {/* Message */}
          {log.message && (
            <div className="text-sm">
              {log.message}
            </div>
          )}

          {/* Prospects */}
          {log.prospects?.length > 0 && (
            <div className="flex items-center gap-2">
              <User2 className="h-3 w-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {log.prospects.slice(0, 3).map((prospect, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {prospect.name || prospect.linkedin_id || "Unknown"}
                  </Badge>
                ))}
                {log.prospects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{log.prospects.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * FailedOperationsTable - Table of failed operations with retry options
 */
function FailedOperationsTable({ operations }) {
  const columns = [
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action?.replace(/_/g, " ") || "Unknown"
        return <Badge variant="destructive">{action}</Badge>
      },
    },
    {
      accessorKey: "message",
      header: "Error Message",
      cell: ({ row }) => {
        const message = row.original.message || ""
        return (
          <div className="max-w-md">
            <div className="text-sm line-clamp-2" title={message}>
              {message}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "start_time",
      header: "Failed At",
      cell: ({ row }) => {
        const startTime = row.original.start_time
        return startTime ? formatRelativeTime(startTime) : "-"
      },
    },
    {
      accessorKey: "prospects",
      header: "Prospects",
      cell: ({ row }) => {
        const prospects = row.original.prospects || []
        if (!prospects.length) return "-"
        
        return (
          <div className="flex items-center gap-1">
            <User2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{prospects.length}</span>
            {prospects.length === 1 && prospects[0].name && (
              <span className="text-xs text-muted-foreground ml-1">
                ({prospects[0].name})
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "retry_eligible",
      header: "Retry",
      cell: ({ row }) => {
        const retryEligible = row.original.retry_eligible
        const operation = row.original
        
        if (!retryEligible) {
          return (
            <Badge variant="outline" className="text-xs">
              Not eligible
            </Badge>
          )
        }
        
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle retry logic
              console.log("Retry operation:", operation.id)
            }}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )
      },
    },
  ]

  const rowActions = (operation) => [
    {
      label: "View Details",
      onSelect: () => {
        // Navigate to log details
        console.log("View operation details:", operation.id)
      },
    },
    ...(operation.retry_eligible ? [
      {
        label: "Retry Operation",
        onSelect: () => {
          console.log("Retry operation:", operation.id)
        },
      }
    ] : []),
  ]

  return (
    <DataTable
      columns={columns}
      data={operations}
      enableSelection={false}
      rowActions={rowActions}
      emptyMessage="No failed operations"
      rowId={(row) => row.id}
      rowClassName="bg-destructive/5"
    />
  )
}
