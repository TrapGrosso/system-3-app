import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react"
import { useNavigate } from 'react-router-dom'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { useDeepSearchQueue } from '@/contexts/DeepSearchQueueContext'
import { PromptSelectDialog } from './PromptSelectDialog'

export default function DeepSearchQueueTable() {
  const { 
    queueItems,
    isLoadingQueue,
    deleteProspects,
    updateProspects,
    resolveProspects,
    isUpdatingQueue,
    isDeletingQueue,
  } = useDeepSearchQueue()

  const navigate = useNavigate()

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = React.useState({})
  const [promptDialogOpen, setPromptDialogOpen] = React.useState(false)
  const [selectedItems, setSelectedItems] = React.useState([])
  const [currentPromptId, setCurrentPromptId] = React.useState(null)

  const handleChangePrompt = React.useCallback((items, currentPrompt = null) => {
    setSelectedItems(items)
    setCurrentPromptId(currentPrompt)
    setPromptDialogOpen(true)
  }, [])

  const handleRemove = React.useCallback((items) => {
    deleteProspects(items)
  }, [deleteProspects])

  const handleResolve = React.useCallback((items) => {
    resolveProspects(items)
  }, [resolveProspects])

  const handleRowClick = React.useCallback((row) => {
    navigate(`/prospects/${row.original.prospect_id}`)
  }, [navigate])

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
      accessorKey: "prompt.name",
      header: "Prompt",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="truncate font-medium" title={row.original.prompt?.name}>
            {row.original.prompt?.name || '—'}
          </div>
          {row.original.prompt?.description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground truncate cursor-help inline-block">
                  {row.original.prompt?.description}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{row.original.prompt?.description}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
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
                handleChangePrompt([{
                  prospect_id: row.original.prospect_id,
                  prompt_id: row.original.prompt_id
                }], row.original.prompt_id)
              }}
            >
              Change Prompt
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleResolve([{
                  prospect_id: row.original.prospect_id,
                  prompt_id: row.original.prompt_id
                }])
              }}
            >
              Resolve
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove([{
                  prospect_id: row.original.prospect_id,
                  prompt_id: row.original.prompt_id
                }])
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
  ], [handleChangePrompt, handleRemove, handleResolve])

  const table = useReactTable({
    data: queueItems || [],
    columns,
    state: {
      pagination,
      rowSelection,
    },
    getRowId: (row) => `${row.prospect_id}-${row.prompt_id}`,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handlePromptConfirm = React.useCallback((newPromptId) => {
    if (selectedItems.length > 0) {
      const prospectIds = selectedItems.map(item => item.prospect_id)
      updateProspects(prospectIds, newPromptId)
      setPromptDialogOpen(false)
      setSelectedItems([])
      setCurrentPromptId(null)
    }
  }, [selectedItems, updateProspects])

  const handleBulkAction = (action) => {
    const selectedItems = selectedRows.map(row => ({
      prospect_id: row.original.prospect_id,
      prompt_id: row.original.prompt_id
    }))
    
    switch (action) {
      case 'changePrompt':
        handleChangePrompt(selectedItems)
        break
      case 'remove':
        handleRemove(selectedItems)
        break
      case 'resolve':
        handleResolve(selectedItems)
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
  if (isLoadingQueue) {
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
              disabled={selectedCount === 0}
              onClick={() => handleBulkAction('resolve')}
            >
              Resolve Selected
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
                  onClick={() => handleRowClick(row)}
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

      {/* Prompt Select Dialog */}
      <PromptSelectDialog
        open={promptDialogOpen}
        onOpenChange={setPromptDialogOpen}
        onConfirm={handlePromptConfirm}
        isLoading={isUpdatingQueue}
        selectedCount={selectedItems.length}
        currentPromptId={currentPromptId}
      />
    </div>
  )
}
