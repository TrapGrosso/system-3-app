import * as React from "react"
import { CheckCircle, XCircle, Clock, Play, User2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/components/shared/ui/ChartKit"
import { ActionDropdown } from "@/components/shared/ui/ActionDropdown"
import { useNavigate } from "react-router-dom"
import { formatDuration } from "@/utils/durationFormat"

/**
 * LogItem - Individual log entry card
 */
export function LogItem({ log }) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/logs/${log.id}`)
  }

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
  const durationMs = log.start_time && log.end_time 
    ? new Date(log.end_time) - new Date(log.start_time)
    : null

  return (
    <Card>
      <CardContent>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(log.status)} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {log.action?.replace(/_/g, " ") || "Unknown"}
                </Badge>
                {durationMs && (
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(durationMs)}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatRelativeTime(log.start_time)}
              </div>
            </div>
            <ActionDropdown
              items={[{ label: "View Details", onSelect: handleViewDetails }]}
              align="end"
              side="bottom"
              sideOffset={4}
            />
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
