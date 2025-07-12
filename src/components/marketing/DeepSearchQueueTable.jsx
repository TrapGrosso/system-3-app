import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function DeepSearchQueueTable({ 
  queueItems,
  isLoading,
  isResolving = false,
  onChangePrompt,
  onRemove,
  onResolve,
  onRowClick,
}) {

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = React.useState({})

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
      accessorKey: "prospect.first_name",
      header: "First Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.prospect?.first_name || '—'}
        </div>
      ),
    },
    {
      accessorKey: "prospect.last_name",
      header: "Last Name",
      cell: ({ row }) => (
        <div>{row.original.prospect?.last_name || '—'}</div>
      ),
    },
    {
      id: "prompts",
      header: "Prompts",
      cell: ({ row }) => {
        const prompts = row.original.prompts || []
        if (prompts.length === 0) return <span className="text-muted-foreground">—</span>
        
        const displayPrompts = prompts.slice(0, 3)
        const remainingCount = prompts.length - 3
        
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {displayPrompts.map((prompt) => (
              <Tooltip key={prompt.id}>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="text-xs cursor-help">
                    {prompt.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">{prompt.name}</p>
                    {prompt.description && <p className="text-xs">{prompt.description}</p>}
                    {prompt.agent_type && <p className="text-xs opacity-75">Type: {prompt.agent_type}</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
            {remainingCount > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-pointer">
                    +{remainingCount}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">All Prompts ({prompts.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {prompts.map((prompt) => (
                        <div key={prompt.id} className="p-2 rounded border">
                          <div className="font-medium text-sm">{prompt.name}</div>
                          {prompt.description && (
                            <div className="text-xs text-muted-foreground mt-1">{prompt.description}</div>
                          )}
                          {prompt.agent_type && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {prompt.agent_type}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "groups",
      header: "Groups",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.groups && row.original.groups.length > 0 
            ? row.original.groups.map(group => group.name).join(', ')
            : '—'
          }
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : '—'}
        </div>
      ),
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
                onChangePrompt([row.original.id])
              }}
            >
              Change Prompt
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isResolving}
              onClick={(e) => {
                e.stopPropagation()
                onResolve([row.original.id])
              }}
            >
              {isResolving ? "Resolving..." : "Resolve"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemove([row.original.id])
              }}
            >
              Remove from Queue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], [onChangePrompt, onRemove, onResolve, isResolving])

  const table = useReactTable({
    data: queueItems || [],
    columns,
    state: {
      pagination,
      rowSelection,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handleBulkAction = (action) => {
    const selectedQueueItemIds = selectedRows.map(row => row.original.id)
    
    switch (action) {
      case 'changePrompt':
        onChangePrompt(selectedQueueItemIds)
        break
      case 'remove':
        onRemove(selectedQueueItemIds)
        break
      case 'resolve':
        onResolve(selectedQueueItemIds)
        break
      default:
        break
    }
  }

  // Pagination helpers
  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const canPreviousPage = table.getCanPreviousPage()
  const canNextPage = table.getCanNextPage()

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
          
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <p className="text-sm text-muted-foreground">Loading queue items...</p>
            </div>
          </div>
        </div>

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
  if (!queueItems || queueItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No items in deep search queue
      </div>
    )
  }

  const paginatedData = table.getRowModel().rows

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={selectedCount === 0}
            >
              Selected ({selectedCount})
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              disabled={selectedCount === 0}
              onClick={() => handleBulkAction('changePrompt')}
            >
              Change Prompt
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={selectedCount === 0 || isResolving}
              onClick={() => handleBulkAction('resolve')}
            >
              {isResolving ? "Resolving..." : "Resolve Selected"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              disabled={selectedCount === 0}
              onClick={() => handleBulkAction('remove')}
            >
              Remove Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            {paginatedData?.length ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => onRowClick(row.original.prospect?.linkedin_id || row.original.prospect_id)}
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
            {selectedCount} of {queueItems?.length || 0} row(s) selected.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="page-size" className="text-sm font-medium">
              Rows per page:
            </Label>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                setPagination(prev => ({ ...prev, pageIndex: 0, pageSize: Number(value) }))
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

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationPrevious 
                  onClick={() => table.previousPage()}
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
                        onClick={() => table.setPageIndex(page)}
                        className="cursor-pointer"
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationNext 
                  onClick={() => table.nextPage()}
                  className={canNextPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                />
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

    </div>
  )
}
