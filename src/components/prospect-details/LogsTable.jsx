import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileTextIcon } from 'lucide-react'
import { DataTable } from '@/components/shared/table/DataTable'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'

export default function LogsTable({ logs = [] }) {
  const formatDate = (dateString) => {
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
    
    if (durationMs < 1000) {
      return `${durationMs} ms`
    } else {
      const seconds = (durationMs / 1000).toFixed(1)
      return `${seconds} s`
    }
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
        <div className="font-medium">
          {row.original.action}
        </div>
      ),
    },
    {
      header: 'Status',
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
        <div className="text-muted-foreground">
          {formatDate(row.original.start_time)}
        </div>
      ),
    },
    {
      header: 'End Time',
      accessorKey: 'end_time',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.end_time ? formatDate(row.original.end_time) : '—'}
        </div>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'duration_ms',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDuration(row.original.duration_ms)}
        </div>
      ),
    },
    {
      header: 'Result',
      accessorKey: 'prospect_result',
      enableSorting: false,
      cell: ({ row }) => {
        const result = row.original.prospect_result
        
        if (!result || !result.result) {
          return <div className="text-center text-muted-foreground">—</div>
        }

        // Convert result object to array of key-value pairs
        const resultEntries = Object.entries(result.result || {})
        
        return (
          <TablePopoverCell
            items={resultEntries}
            title="Prospect Result"
            triggerVariant="blue"
            icon={<FileTextIcon />}
            renderItem={([key, value]) => (
              <div className="p-2 border rounded-md text-sm">
                <div className="font-medium text-foreground">{key}</div>
                <div className="text-muted-foreground mt-1">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            )}
          />
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
        <DataTable
          columns={columns}
          data={logs}
          rowId={(row) => row.log_id}
          enableSelection={false}
          emptyMessage="No logs found"
          onRowClick={() => {}} // Disable row clicks
          pageSizes={[10, 20, 30]}
        />
      </CardContent>
    </Card>
  )
}
