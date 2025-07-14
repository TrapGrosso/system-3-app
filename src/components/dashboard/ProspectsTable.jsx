import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, MoreHorizontalIcon, NotebookIcon, CalendarIcon } from "lucide-react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Spinner } from '@/components/ui/spinner'
import { useProspects } from '@/contexts/ProspectsContext'

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'secondary'
    case 'contacted':
      return 'default'
    case 'qualified':
      return 'default'
    default:
      return 'outline'
  }
}

const getBooleanVariant = (value) => {
  return value ? 'default' : 'outline'
}

export default function ProspectsTable({ 
  onRowClick,
  onAddNote,
  onCreateTask,
  onAddToGroup,
  onAddToCampaign,
  onAddToDeepSearch,
  onBulkAddToGroup,
  onBulkAddToCampaign,
  onBulkAddToDeepSearch
}) {
  
  // Get data and state from context
  const { 
    data: prospects, 
    total, 
    query, 
    setQuery, 
    isLoading 
  } = useProspects()

  const columns = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row" />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.first_name || '—'}
        </div>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => (
        <div>{row.original.last_name || '—'}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="truncate" title={row.original.title || row.original.headline}>
            {row.original.title || row.original.headline || '—'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status || 'Unknown'}
        </Badge>
      ),
    },
    {
      accessorKey: "in_group",
      header: "Group",
      cell: ({ row }) => (
        <Badge variant={getBooleanVariant(row.original.groups?.length > 0)}>
          {row.original.groups?.length > 0 ? '✓' : '—'}
        </Badge>
      ),
    },
    {
      accessorKey: "in_campaign",
      header: "Campaign",
      cell: ({ row }) => (
        <Badge variant={getBooleanVariant(row.original.campaigns?.length > 0)}>
          {row.original.campaigns?.length > 0 ? '✓' : '—'}
        </Badge>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div>
          {row.original.email ? (
            <a 
              href={`mailto:${row.original.email}`}
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.original.email}
            </a>
          ) : (
            '—'
          )}
        </div>
      ),
    },
    {
      accessorKey: "company_name",
      header: "Company",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="truncate" title={row.original.company_name}>
            {row.original.company_name || '—'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const notes = row.original.notes || []
        const noteCount = row.original.note_count || notes.length || 0
        
        if (noteCount === 0) {
          return <div className="text-center text-muted-foreground">—</div>
        }

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-blue-600 hover:text-blue-800"
                onClick={(e) => e.stopPropagation()}
              >
                <NotebookIcon className="h-4 w-4 mr-1" />
                {noteCount}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Notes</h4>
                {notes.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notes.map((note) => (
                      <div key={note.id} className="p-2 border rounded-md text-sm">
                        <p className="text-foreground">{note.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes available</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )
      },
    },
    {
      accessorKey: "tasks",
      header: "Tasks",
      cell: ({ row }) => {
        const tasks = row.original.tasks || []
        const taskCount = row.original.task_count || tasks.length || 0
        
        if (taskCount === 0) {
          return <div className="text-center text-muted-foreground">—</div>
        }

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-green-600 hover:text-green-800"
                onClick={(e) => e.stopPropagation()}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                {taskCount}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Tasks</h4>
                {tasks.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-2 border rounded-md text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium">{task.title}</h5>
                          <Badge variant={task.status === 'open' ? 'default' : 'secondary'}>
                            {task.status}
                          </Badge>
                        </div>
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                        {task.description && (
                          <p className="text-foreground">{task.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks available</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                if (onAddNote) {
                  onAddNote(row.original.linkedin_id, row.original)
                } else {
                  alert(`Add note for ${row.original.first_name} ${row.original.last_name}`)
                }
              }}
            >
              Add Note
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                if (onCreateTask) {
                  onCreateTask(row.original.linkedin_id, row.original)
                } else {
                  alert(`Create task for ${row.original.first_name} ${row.original.last_name}`)
                }
              }}
            >
              Create Task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                if (onAddToGroup) {
                  onAddToGroup(row.original.linkedin_id)
                } else {
                  alert(`Add ${row.original.first_name} ${row.original.last_name} to group`)
                }
              }}
            >
              Add to Group
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                if (onAddToCampaign) {
                  onAddToCampaign(row.original.linkedin_id)
                } else {
                  alert(`Add ${row.original.first_name} ${row.original.last_name} to campaign`)
                }
              }}
            >
              Add to Campaign
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                if (onAddToDeepSearch) {
                  onAddToDeepSearch(row.original.linkedin_id)
                }
              }}
            >
              Add to Deep Search Queue
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                alert(`Delete ${row.original.first_name} ${row.original.last_name}`)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], [onAddNote, onCreateTask, onAddToGroup, onAddToCampaign, onAddToDeepSearch])

  const [rowSelection, setRowSelection] = React.useState({})

  // Convert context data to TanStack Table format
  const pageIndex = query.page - 1
  const pageSize = query.page_size
  const sorting = [{ id: query.sort_by, desc: query.sort_dir === 'desc' }]

  const pagination = React.useMemo(() => ({
    pageIndex,
    pageSize,
  }), [pageIndex, pageSize])

  const table = useReactTable({
    data: prospects,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.linkedin_id,
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(total / pageSize),
    onRowSelectionChange: setRowSelection,
    onSortingChange: (sorting) => {
      const s = sorting[0] || {}
      setQuery({ 
        sort_by: s.id || 'created_at', 
        sort_dir: s.desc ? 'desc' : 'asc' 
      })
    },
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setQuery({ page: pageIndex + 1, page_size: pageSize })
    },
    getCoreRowModel: getCoreRowModel(),
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handleRowClick = (prospect) => {
    if (onRowClick) {
      onRowClick(prospect.linkedin_id)
    } else {
      alert(`row clicked '${prospect.linkedin_id}'`)
    }
  }

  const handleBulkAction = (action) => {
    const selectedLinkedinIds = selectedRows.map(row => row.original.linkedin_id)
    
    switch (action) {
      case 'email':
        alert(`Send email to ${selectedCount} prospects`)
        break
      case 'delete':
        alert(`Delete ${selectedCount} prospects`)
        break
      case 'export':
        alert(`Export ${selectedCount} prospects`)
        break
      case 'addToGroup':
        if (onBulkAddToGroup) {
          onBulkAddToGroup(selectedLinkedinIds)
        } else {
          alert(`Add ${selectedCount} prospects to group`)
        }
        break
      case 'addToCampaign':
        if (onBulkAddToCampaign) {
          onBulkAddToCampaign(selectedLinkedinIds)
        } else {
          alert(`Add ${selectedCount} prospects to campaign`)
        }
        break
      case 'addToDeepSearch':
        if (onBulkAddToDeepSearch) {
          onBulkAddToDeepSearch(selectedLinkedinIds)
        }
        break
      default:
        break
    }
  }

  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const canPreviousPage = table.getCanPreviousPage()
  const canNextPage = table.getCanNextPage()

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(0, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (range[0] > 1) {
      rangeWithDots.push(0)
      if (range[0] > 2) {
        rangeWithDots.push('...')
      }
    }

    rangeWithDots.push(...range)

    if (range[range.length - 1] < totalPages - 2) {
      if (range[range.length - 1] < totalPages - 3) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(totalPages - 1)
    }

    return rangeWithDots
  }

  // Show loading overlay while loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Table structure with loading overlay */}
        <div className="relative rounded-md border min-h-[400px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
          
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <p className="text-sm text-muted-foreground">Loading prospects...</p>
            </div>
          </div>
        </div>

        {/* Disabled pagination controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between opacity-50 pointer-events-none">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Loading...</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Rows per page:</Label>
              <Select disabled>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
              </Select>
            </div>
            <div className="text-sm font-medium">Page - of -</div>
          </div>
        </div>
      </div>
    )
  }

  // Show no results message
  if (!prospects || prospects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prospects found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Selected ({selectedCount})
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkAction('addToGroup')}>
                Add to Group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('addToCampaign')}>
                Add to Campaign
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('addToDeepSearch')}>
                Add to Deep Search Queue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction('email')}>
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleBulkAction('delete')}
              >
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(row.original)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleRowClick(row.original)
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {selectedCount} of {total} row(s) selected.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="page-size" className="text-sm font-medium">
              Rows per page:
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setQuery({ page: 1, page_size: Number(value) })
              }}
            >
              <SelectTrigger className="w-20" id="page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm font-medium">
            Page {currentPage + 1} of {totalPages}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationPrevious 
                onClick={() => setQuery({ page: currentPage })}
                className={canPreviousPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              />
              
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setQuery({ page: page + 1 })}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              <PaginationNext 
                onClick={() => setQuery({ page: currentPage + 2 })}
                className={canNextPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
