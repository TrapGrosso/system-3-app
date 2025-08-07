import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ZapIcon, CalendarIcon, ClockIcon } from 'lucide-react'
import AdvancedFiltersCollapsible from '@/components/shared/ui/AdvancedFiltersCollapsible'

export default function LogMainCard({ log }) {
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (durationMs) => {
    if (!durationMs) return '—'
    
    let seconds = Math.floor(durationMs / 1000)
    const hours = Math.floor(seconds / 3600)
    seconds = seconds % 3600
    const minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    
    const parts = []
    if (hours > 0) parts.push(`${hours} h`)
    if (minutes > 0) parts.push(`${minutes} m`)
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} s`)
    
    return parts.join(' ')
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'default'
      case 'error':
      case 'failed':
        return 'destructive'
      case 'running':
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (!log) {
    return (
      <Card className="mb-6">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <ZapIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No log data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ZapIcon className="h-5 w-5 text-blue-500" />
          Log Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {/* Action */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Action</p>
            <div className="flex items-center gap-2">
              <ZapIcon className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{log.action}</span>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={getStatusVariant(log.status)}>
              {log.status}
            </Badge>
          </div>

          {/* Start Time */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Start Time</p>
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(log.start_time)}</span>
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">End Time</p>
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(log.end_time)}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Duration</p>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {formatDuration(log.duration_ms)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Message & Metadata Collapsible */}
        {(log.message || (log.metadata && Object.keys(log.metadata).length > 0)) && (
          <div className="mt-6">
            <AdvancedFiltersCollapsible
              label="Message & Metadata"
              defaultOpen={false}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Message */}
                {log.message && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Message</p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{log.message}</p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Metadata</p>
                    <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Show placeholder if both are empty */}
              {!log.message && (!log.metadata || Object.keys(log.metadata).length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No additional details available.
                </p>
              )}
            </AdvancedFiltersCollapsible>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
