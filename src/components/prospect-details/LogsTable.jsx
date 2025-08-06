import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { FileTextIcon, CheckIcon, XIcon, ZapIcon, CopyIcon } from 'lucide-react'
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

  const getDurationVariant = (durationMs) => {
    if (!durationMs) return 'outline'
    if (durationMs < 500) return 'default' // Green
    if (durationMs < 2000) return 'secondary' // Yellow
    return 'destructive' // Red for > 2s
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

  const copyToClipboard = async (data) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const ResultPopover = ({ result }) => {
    if (!result || Object.keys(result).length === 0) {
      return <div className="text-center text-muted-foreground">—</div>
    }

    const resultEntries = Object.entries(result)
    
    return (
      <TablePopoverCell
        items={resultEntries}
        title="Prospect Result"
        triggerVariant="blue"
        icon={<FileTextIcon />}
        renderItem={([key, value]) => (
          <div className="p-3 border rounded-md text-sm bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-foreground">{key}</div>
              {typeof value === 'boolean' && (
                <Badge variant="secondary" className="text-xs">
                  {value ? 'true' : 'false'}
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground">
              {typeof value === 'object' ? (
                <pre className="font-mono text-xs overflow-x-auto bg-muted p-2 rounded">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <span className="break-words">{String(value)}</span>
              )}
            </div>
          </div>
        )}
        headerActions={
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(result)}
            className="h-6 w-6 p-0"
            aria-label="Copy JSON"
          >
            <CopyIcon className="h-3 w-3" />
          </Button>
        }
      />
    )
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
      header: 'Success',
      accessorKey: 'prospect_success',
      enableSorting: true,
      cell: ({ row }) => {
        const success = row.original.prospect_success
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant={success ? 'default' : 'destructive'}
                className="w-8 h-6 p-0 flex items-center justify-center"
              >
                {success ? (
                  <CheckIcon className="h-3 w-3" />
                ) : (
                  <XIcon className="h-3 w-3" />
                )}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {success ? 'Success' : 'Failed'}
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      header: 'Start Time',
      accessorKey: 'start_time',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {formatDate(row.original.start_time)}
        </div>
      ),
    },
    {
      header: 'End Time',
      accessorKey: 'end_time',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {row.original.end_time ? formatDate(row.original.end_time) : '—'}
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
            variant={getDurationVariant(duration)}
            className="text-xs"
          >
            {formatDuration(duration)}
          </Badge>
        )
      },
    },
    {
      header: 'Result',
      accessorKey: 'prospect_result',
      enableSorting: false,
      cell: ({ row }) => (
        <ResultPopover result={row.original.prospect_result} />
      ),
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
          rowId={(row) => row.id}
          enableSelection={false}
          emptyMessage="No logs found"
          onRowClick={() => {}} // Disable row clicks
          pageSizes={[10, 20, 30]}
          initialState={{
            sorting: [{ id: 'start_time', desc: true }]
          }}
        />
      </CardContent>
    </Card>
  )
}
