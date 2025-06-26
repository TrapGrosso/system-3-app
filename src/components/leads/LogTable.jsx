import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RotateCcw } from 'lucide-react'

// Mock data for demonstration - replace with actual Supabase data later
const mockLogs = [
  {
    id: "1",
    status: "success",
    start_time: "2025-01-15T10:30:00Z",
    end_time: "2025-01-15T10:30:02Z",
    duration_ms: 2000,
    message: "Successfully processed 25 leads"
  },
  {
    id: "2",
    status: "failed",
    start_time: "2025-01-15T10:35:00Z",
    end_time: "2025-01-15T10:35:05Z",
    duration_ms: 5000,
    message: "Failed to process leads: Network timeout"
  },
  {
    id: "3",
    status: "in_progress",
    start_time: "2025-01-15T10:40:00Z",
    end_time: null,
    duration_ms: null,
    message: "Processing 10 leads..."
  },
  {
    id: "4",
    status: "success",
    start_time: "2025-01-15T09:20:00Z",
    end_time: "2025-01-15T09:20:01Z",
    duration_ms: 1200,
    message: "Successfully processed 5 leads"
  },
  {
    id: "5",
    status: "failed",
    start_time: "2025-01-15T09:15:00Z",
    end_time: "2025-01-15T09:15:03Z",
    duration_ms: 3000,
    message: "Failed to process leads: Invalid URL format"
  }
]

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

export const LogTable = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Processing Logs</h3>
        <Badge variant="outline" className="text-xs">
          {mockLogs.length} total logs
        </Badge>
      </div>
      
      {mockLogs.length === 0 ? (
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
              {mockLogs.map((log) => (
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
                    <span className="text-sm truncate block" title={log.message}>
                      {log.message}
                    </span>
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
