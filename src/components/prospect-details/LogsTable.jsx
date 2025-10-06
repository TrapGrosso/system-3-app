import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileTextIcon, ZapIcon, X, CheckIcon, CalendarIcon } from 'lucide-react'
import { DataTable } from '@/components/shared/table/DataTable'
import { formatAbsolute } from '@/utils/timeformat'

// Sidebar component to display log details
function LogSidebar({ log, onClear }) {
  if (!log) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6">
          <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No log selected</p>
          <p className="text-xs text-muted-foreground mt-1">Select a log from the table to view details</p>
        </div>
      </div>
    )
  }

  const { prospect_success, prospect_created_at, prospect_result } = log

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Log Details</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 w-6 p-0"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {(prospect_success !== undefined || prospect_created_at || prospect_result) ? (
        <div className="space-y-4">
          {prospect_success !== undefined && (
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Status</span>
              <Badge variant={prospect_success ? 'default' : 'destructive'}>
                {prospect_success ? 'Success' : 'Failed'}
              </Badge>
            </div>
          )}

          {prospect_created_at && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{formatAbsolute(prospect_created_at, { dateStyle: "short", timeStyle: "short" })}</span>
            </div>
          )}

          {prospect_result && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Result</h4>
                <pre className="w-full max-w-full overflow-x-auto font-mono text-xs bg-muted p-3 rounded">
                  {JSON.stringify(prospect_result, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No prospect data available</p>
      )}
    </div>
  )
}

export default function LogsTable({ logs = [] }) {
  const [selectedLog, setSelectedLog] = useState(null)

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

  const columns = [
    {
      header: 'Action',
      accessorKey: 'action',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <ZapIcon className="h-4 w-4 text-blue-500" />
          {row.original.action}
        </div>
      ),
    },
    {
      header: 'Job Status',
      accessorKey: 'status',
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      header: 'Start Time',
      accessorKey: 'start_time',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {formatAbsolute(row.original.start_time, { dateStyle: "short", timeStyle: "short" })}
        </div>
      ),
    },
    {
      header: 'End Time',
      accessorKey: 'end_time',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {row.original.end_time ? formatAbsolute(row.original.end_time, { dateStyle: "short", timeStyle: "short" }) : '—'}
        </div>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'duration_ms',
      enableSorting: true,
      cell: ({ row }) => {
        const duration = row.original.duration_ms
        return (
          <Badge 
            variant="outline"
            className="text-xs"
          >
            {formatDuration(duration)}
          </Badge>
        )
      },
    },
  ]

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No logs yet</p>
            <p className="text-sm">Activity logs for this prospect will appear here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Logs ({logs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="w-full xl:flex-none xl:w-3/4 2xl:w-2/3">
            <DataTable
              columns={columns}
              data={logs}
              rowId={(row) => row.id}
              enableSelection={false}
              emptyMessage="No logs found"
              onRowClick={setSelectedLog}
              rowClassName={(row) => selectedLog?.id === row.id ? 'bg-muted' : ''}
              pageSizes={[10, 20, 30]}
              initialState={{
                sorting: [{ id: 'start_time', desc: true }]
              }}
            />
          </div>
          
          <div className="w-full flex-1 min-w-0">
            <LogSidebar 
              log={selectedLog} 
              onClear={() => setSelectedLog(null)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
