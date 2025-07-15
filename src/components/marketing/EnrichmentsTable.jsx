import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { useEnrichments } from '@/contexts/EnrichmentsContext'

const getTypeVariant = (type) => {
  switch (type?.toLowerCase()) {
    case 'bd_scrape':
      return 'secondary'
    case 'deep_search':
      return 'default'
    default:
      return 'outline'
  }
}

export default function EnrichmentsTable() {
  const navigate = useNavigate()
  
  // Get data and state from context
  const { 
    data: enrichments, 
    total, 
    query, 
    setQuery, 
    isLoading 
  } = useEnrichments()

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
          {row.original.prospect?.first_name || '—'}
        </div>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => (
        <div>{row.original.prospect?.last_name || '—'}</div>
      ),
    },
    {
      accessorKey: "company_name",
      header: "Company",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="truncate" title={row.original.company?.name}>
            {row.original.company?.name || '—'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "enrichment_counts",
      header: "Enrichments",
      cell: ({ row }) => {
        const prospectCount = row.original.prospect_enrichments?.length || 0
        const companyCount = row.original.company_enrichments?.length || 0
        
        return (
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="h-auto p-0 font-normal" onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline">
                    {prospectCount} / {companyCount}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Enrichment Counts</div>
                  <div className="space-y-1 text-sm">
                    <div>Prospect: {prospectCount}</div>
                    <div>Company: {companyCount}</div>
                    <div className="pt-1 border-t text-xs text-muted-foreground">
                      Total: {prospectCount + companyCount}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "types",
      header: "Types",
      cell: ({ row }) => {
        const allEnrichments = [
          ...(row.original.prospect_enrichments || []),
          ...(row.original.company_enrichments || [])
        ]
        
        const uniqueTypes = [...new Set(allEnrichments.map(e => e.type).filter(Boolean))]
        
        if (uniqueTypes.length === 0) {
          return <div className="text-muted-foreground">—</div>
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {uniqueTypes.map((type) => (
              <Badge key={type} variant={getTypeVariant(type)} className="text-xs">
                {type === 'bd_scrape' ? 'BD Scrape' : type === 'deep_search' ? 'Deep Search' : type}
              </Badge>
            ))}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "variables",
      header: "Variables",
      cell: ({ row }) => {
        const variables = row.original.variables || []
        
        if (variables.length === 0) {
          return <div className="text-muted-foreground">—</div>
        }
        
        return (
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="h-auto p-0 font-normal" onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline">
                    {variables.length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Variables ({variables.length})</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {variables.map((variable, index) => (
                      <div key={variable.id || index} className="text-sm">
                        <div className="font-medium">{variable.name}</div>
                        {variable.value && (
                          <div className="text-muted-foreground truncate">{variable.value}</div>
                        )}
                        {variable.tags && variable.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {variable.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "prompt_names",
      header: "Prompts",
      cell: ({ row }) => {
        const allEnrichments = [
          ...(row.original.prospect_enrichments || []),
          ...(row.original.company_enrichments || [])
        ]
        
        const uniquePromptNames = [...new Set(
          allEnrichments
            .map(e => e.prompt?.name)
            .filter(Boolean)
        )]
        
        if (uniquePromptNames.length === 0) {
          return <div className="text-muted-foreground">—</div>
        }
        
        return (
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="h-auto p-0 font-normal" onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline">
                    {uniquePromptNames.length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Prompts ({uniquePromptNames.length})</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {uniquePromptNames.map((promptName, index) => (
                      <div key={index} className="text-sm">
                        {promptName}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )
      },
      enableSorting: false,
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
                toast.info('Functionality not yet implemented')
              }}
            >
              Create Variable
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], [])

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
    data: enrichments,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    getRowId: (row, index) => {
      // Create a unique ID for each row since we don't have a single unique identifier
      return `${row.prospect?.linkedin_id || 'no-prospect'}-${row.company?.linkedin_id || 'no-company'}-${index}`
    },
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

  const handleRowClick = (enrichmentBundle) => {
    // Only navigate if there's a prospect to navigate to
    if (enrichmentBundle.prospect?.linkedin_id) {
      navigate(`/prospects/${enrichmentBundle.prospect.linkedin_id}`)
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
              <p className="text-sm text-muted-foreground">Loading enrichments...</p>
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
  if (!enrichments || enrichments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No enrichments found
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
                  className={row.original.prospect?.linkedin_id ? "cursor-pointer" : ""}
                  onClick={() => handleRowClick(row.original)}
                  role={row.original.prospect?.linkedin_id ? "button" : undefined}
                  tabIndex={row.original.prospect?.linkedin_id ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (row.original.prospect?.linkedin_id && (e.key === 'Enter' || e.key === ' ')) {
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
