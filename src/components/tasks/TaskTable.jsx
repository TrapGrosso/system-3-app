import * as React from "react"
import { Calendar, CheckSquare, Clock, ClipboardList } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DataTable } from "@/components/shared/table/DataTable"
import TaskFilters from "./TaskFilters"
import { useAllTasks } from "@/contexts/TaskContext"
import { formatAbsolute } from "@/utils/timeformat"

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'secondary'
    case 'in_progress':
      return 'default'
    case 'done':
      return 'outline'
    case 'canceled':
      return 'destructive'
    case 'overdue':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    case 'overdue':
      return 'Overdue'
    default:
      return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
  }
}

function TaskTable({ onSelect, selectedTaskId, className }) {
  const {
    data: tasks = [],
    total,
    isLoading,
    isError,
    error,
    refetch,
    query,
    setQuery,
    resetFilters,
  } = useAllTasks()


  // Column definitions
  const columns = React.useMemo(() => [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const title = row.original.title || '—'
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium cursor-default truncate max-w-xs">
                {title}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.original.due_date
        return dueDate ? (
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            {formatAbsolute(dueDate, { mode: "date", dateStyle: "short" })}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">No due date</span>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      cell: ({ row }) => {
        const description = row.original.description || 'No description'
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate text-sm text-muted-foreground max-w-sm">
                {description}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.original.created_at
        return createdAt ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatAbsolute(createdAt, { mode: "date", dateStyle: "short" })}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )
      },
    },
    {
      accessorKey: "ended_at",
      header: "Ended",
      cell: ({ row }) => {
        const endedAt = row.original.ended_at
        return endedAt ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckSquare className="h-3 w-3" />
            {formatAbsolute(endedAt, { mode: "date", dateStyle: "short" })}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )
      },
    },
    {
      accessorKey: "prospect_id",
      header: "Prospect",
      enableSorting: false,
      cell: ({ row }) => {
        const prospectId = row.original.prospect_id
        return prospectId ? (
          <Badge variant="outline" className="truncate max-w-[120px]">
            {prospectId}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
    },
  ], [])

  // External pagination state
  const paginationState = React.useMemo(() => ({
    pageIndex: query.page - 1,
    pageSize: query.page_size,
    pageCount: Math.ceil(total / query.page_size),
    totalElements: total || null
  }), [query.page, query.page_size, total])

  // Pagination handler
  const handlePaginationChange = React.useCallback((update) => {
    if (update.pageIndex !== undefined) {
      setQuery({ page: update.pageIndex + 1 })
    }
    if (update.pageSize !== undefined) {
      setQuery({ page_size: update.pageSize, page: 1 })
    }
  }, [setQuery])

  // Sorting state and handler
  const sorting = React.useMemo(() => [
    { id: query.sort_by, desc: query.sort_dir === 'desc' }
  ], [query.sort_by, query.sort_dir])

  const handleSortingChange = React.useCallback((updatedSorting) => {
    const newSorting = typeof updatedSorting === 'function' ? updatedSorting(sorting) : updatedSorting
    const s = newSorting[0] || {}
    setQuery({ 
      sort_by: s.id || 'created_at', 
      sort_dir: s.desc ? 'desc' : 'asc',
      page: 1
    })
  }, [setQuery, sorting])

  // Check if there are active filters
  const hasActiveFilters = React.useMemo(() => {
    return query.title || query.description || query.status || 
           query.due_date_from || query.due_date_to || 
           query.ended_at_from || query.ended_at_to
  }, [query])

  // Empty message based on filters
  const emptyMessage = React.useMemo(() => {
    if (hasActiveFilters) {
      return 'No tasks match your filter'
    }
    return 'No tasks found'
  }, [hasActiveFilters])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <TaskFilters />
      
      {/* DataTable */}
      <DataTable
        columns={columns}
        data={tasks}
        rowId={(row) => row.id}
        loading={isLoading}
        error={isError}
        errorMessage={error?.message || 'Failed to load tasks'}
        emptyMessage={emptyMessage}
        enableSelection={false}
        mode="external"
        paginationState={paginationState}
        onPaginationChange={handlePaginationChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        manualSorting={true}
        rowClassName={(row) => row.id === selectedTaskId ? 'bg-muted' : undefined}
        onRowClick={onSelect}
      />
    </div>
  )
}

export default TaskTable
