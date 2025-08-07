import * as React from "react"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { RotateCcw, AlertCircle, Loader2 } from 'lucide-react'
import { DataTable } from '../shared/table/DataTable'

// Helper function to format action labels
const formatActionLabel = (action) => {
  if (!action) return '-'
  return action
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

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

export const LogTable = ({ 
  data = [],
  total = 0,
  query,
  onQueryChange,
  loading = false,
  isError = false,
  error = null,
  onRetry,
  isRetryPending = false,
  onRowClick = () => {}
}) => {
  // Column definitions for DataTable
  const columns = React.useMemo(() => [
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "action",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs font-medium">
          {formatActionLabel(row.original.action)}
        </Badge>
      ),
    },
    {
      accessorKey: "start_time",
      header: "Start Time",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {formatDateTime(row.original.start_time)}
        </div>
      ),
    },
    {
      accessorKey: "end_time", 
      header: "End Time",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {formatDateTime(row.original.end_time)}
        </div>
      ),
    },
    {
      accessorKey: "duration_ms",
      header: "Duration",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {formatDuration(row.original.duration_ms)}
        </div>
      ),
    },
    {
      accessorKey: "prospect_count",
      header: "Prospects",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-center font-mono text-sm">
          {row.original.prospect_count !== undefined ? row.original.prospect_count : '-'}
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: "Message",
      enableSorting: false, 
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm truncate block cursor-help">
                {row.original.message}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{row.original.message}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "actions",
      header: null,
      enableSorting: false,
      cell: ({ row }) => {
        const log = row.original
        return log.status === 'failed' && log.retry_eligible ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRetry(log.id)
            }}
            disabled={isRetryPending}
            className="h-8 w-full"
          >
            {isRetryPending ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RotateCcw className="h-3 w-3 mr-1" />
            )}
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
        )
      },
    },
  ], [onRetry, isRetryPending])

  // External pagination state (handled in table)
  const paginationState = React.useMemo(() => ({
    pageIndex: query?.page ? query.page - 1 : 0,
    pageSize: query?.page_size || 10,
    pageCount: Math.ceil(total / (query?.page_size || 10)),
    totalElements: total,
  }), [query, total])

  // Pagination handler (kept in table file)
  const handlePaginationChange = React.useCallback((update) => {
    if (update.pageIndex !== undefined) {
      onQueryChange({ page: update.pageIndex + 1 })
    }
    if (update.pageSize !== undefined) {
      onQueryChange({ page_size: update.pageSize, page: 1 })
    }
  }, [onQueryChange])

  // Sorting state and handler
  const sorting = React.useMemo(() => [
    { id: query?.sort_by || 'created_at', desc: (query?.sort_dir || 'desc') === 'desc' }
  ], [query?.sort_by, query?.sort_dir])

  const handleSortingChange = React.useCallback((updatedSorting) => {
    const newSorting = typeof updatedSorting === 'function' ? updatedSorting(sorting) : updatedSorting
    const s = newSorting[0] || {}
    onQueryChange({ 
      sort_by: s.id || 'created_at', 
      sort_dir: s.desc ? 'desc' : 'asc' 
    })
  }, [onQueryChange, sorting])

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

  // Header with count
  const header = (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Processing Logs</h3>
      {!loading && (
        <Badge variant="outline" className="text-xs">
          {total} total logs
        </Badge>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {header}
      <DataTable
        columns={columns}
        data={data}
        rowId={(row) => row.id}
        loading={loading}
        emptyMessage="No logs available yet. Logs will appear here after processing leads."
        mode="external"
        paginationState={paginationState}
        onPaginationChange={handlePaginationChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        manualSorting={true}
        enableSelection={false}
        onRowClick={onRowClick}
      />
    </div>
  )
}
