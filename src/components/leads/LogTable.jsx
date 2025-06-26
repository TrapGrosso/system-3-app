import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { RotateCcw, AlertCircle, Loader2 } from 'lucide-react'

const getStatusBadge = (status) => {
  switch (status) {
    case 'success':
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Success</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    case 'in_progress':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">In Progress</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatDuration = (durationMs) => {
  if (!durationMs) return '-'
  
  if (durationMs < 1000) {
    return `${durationMs}ms`
  } else if (durationMs < 60000) {
    return `${(durationMs / 1000).toFixed(1)}s`
  } else {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = ((durationMs % 60000) / 1000).toFixed(1)
    return `${minutes}m ${seconds}s`
  }
}

const handleRetry = (logId) => {
  // TODO: Implement retry logic when Supabase integration is added
  console.log('Retrying log:', logId)
}

export const LogTable = ({ logs = [], isLoading = false, isError = false, error = null }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Processing Logs</h3>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[180px]">Start Time</TableHead>
                <TableHead className="w-[180px]">End Time</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Processing Logs</h3>
          <Badge variant="destructive" className="text-xs">
            Error
          </Badge>
        </div>
        
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
          <p className="text-sm font-medium">Failed to load logs</p>
          <p className="text-xs mt-1">{error?.message || 'An unexpected error occurred'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Processing Logs</h3>
        <Badge variant="outline" className="text-xs">
          {logs.length} total logs
        </Badge>
      </div>
      
      {logs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No logs available yet.</p>
          <p className="text-xs mt-1">Logs will appear here after processing leads.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[180px]">Start Time</TableHead>
                <TableHead className="w-[180px]">End Time</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {getStatusBadge(log.status)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatDateTime(log.start_time)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatDateTime(log.end_time)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatDuration(log.duration_ms)}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm truncate block cursor-help">
                          {log.message}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">{log.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {log.status === 'failed' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRetry(log.id)}
                        className="h-8 w-full"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="h-8 w-full opacity-50 cursor-not-allowed"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
