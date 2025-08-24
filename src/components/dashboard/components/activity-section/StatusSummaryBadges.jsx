import * as React from "react"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/components/shared/ui/ChartKit"

/**
 * StatusSummaryBadges - Three badges showing success, failed, in_progress counts
 */
export function StatusSummaryBadges({ byStatus }) {
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