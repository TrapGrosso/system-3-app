import * as React from "react"
import { Calendar, CheckSquare, Clock, ClipboardList } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import TaskFilters from "./TaskFilters"
import { useAllTasks } from "@/contexts/TaskContext"

// Helper functions copied from ProspectTasksDialog
const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

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
  const [currentPage, setCurrentPage] = React.useState(1)
  const [filter, setFilter] = React.useState(null)
  const perPage = 10

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useAllTasks()

  // Apply filtering
  const filteredTasks = React.useMemo(() => {
    if (!filter) return tasks

    return tasks.filter(task => {
      const { field, value } = filter
      
      switch (field) {
        case 'title':
          return task.title?.toLowerCase().includes(value.toLowerCase())
        case 'description':
          return task.description?.toLowerCase().includes(value.toLowerCase())
        case 'due_date':
          // Compare date strings (YYYY-MM-DD format)
          return task.due_date === value
        default:
          return true
      }
    })
  }, [tasks, filter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const handleFilterApply = (filterData) => {
    setFilter(filterData)
  }

  const handleFilterClear = () => {
    setFilter(null)
  }

  const handleRowClick = (task) => {
    onSelect(task)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <TaskFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`space-y-4 ${className}`}>
        <TaskFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="text-center py-8">
          <p className="text-sm text-destructive mb-2">Failed to load tasks</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <TaskFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">
            {filter ? 'No tasks match your filter' : 'No tasks found'}
          </p>
          <p className="text-xs text-muted-foreground">
            {filter ? 'Try adjusting your filter criteria' : 'Create your first task to get started'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <TaskFilters onApply={handleFilterApply} onClear={handleFilterClear} />

      {/* Results info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} tasks
          {filter && ` (filtered from ${tasks.length} total)`}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => handleRowClick(task)}
                className={`cursor-pointer hover:bg-muted/50 ${
                  selectedTaskId === task.id ? 'bg-muted' : ''
                }`}
              >
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate" title={task.title}>
                    {task.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(task.status)}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.due_date ? (
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {formatDate(task.due_date)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">No due date</span>
                  )}
                </TableCell>
                <TableCell className="max-w-sm">
                  <div className="truncate text-sm text-muted-foreground" title={task.description}>
                    {task.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(task.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  )
                }
                return null
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default TaskTable
