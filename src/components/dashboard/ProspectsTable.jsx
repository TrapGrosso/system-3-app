import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, MoreHorizontalIcon, SearchIcon } from "lucide-react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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
  prospects = [], 
  onRowClick,
  onAddToGroup,
  onAddToCampaign,
  onAddToDeepSearch,
  onBulkAddToGroup,
  onBulkAddToCampaign,
  onBulkAddToDeepSearch
}) {
  
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
      filterFn: (row, id, value) => {
        const firstName = row.original.first_name || ''
        const lastName = row.original.last_name || ''
        const fullName = `${firstName} ${lastName}`.toLowerCase()
        return fullName.includes(value.toLowerCase())
      },
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
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return row.original.status?.toLowerCase() === value.toLowerCase()
      },
    },
    {
      accessorKey: "in_group",
      header: "Group",
      cell: ({ row }) => (
        <Badge variant={getBooleanVariant(row.original.groups?.length > 0)}>
          {row.original.groups?.length > 0 ? '✓' : '—'}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        const groups = row.original.groups || []
        if (value === 'none') return groups.length === 0
        if (value === 'yes') return groups.length > 0
        if (value === 'no') return groups.length === 0
        // Check for specific group name
        return groups.some(g => (g.name || '').toLowerCase() === value.toLowerCase())
      },
    },
    {
      accessorKey: "in_campaign",
      header: "Campaign",
      cell: ({ row }) => (
        <Badge variant={getBooleanVariant(row.original.campaigns?.length > 0)}>
          {row.original.campaigns?.length > 0 ? '✓' : '—'}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        const campaigns = row.original.campaigns || []
        if (value === 'none') return campaigns.length === 0
        if (value === 'yes') return campaigns.length > 0
        if (value === 'no') return campaigns.length === 0
        // Check for specific campaign name
        return campaigns.some(c => (c.name || '').toLowerCase() === value.toLowerCase())
      },
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
      accessorKey: "note_count",
      header: "Notes",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.note_count || 0}
        </div>
      ),
    },
    {
      accessorKey: "task_count",
      header: "Tasks",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.task_count || 0}
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
                alert(`Add note for ${row.original.first_name} ${row.original.last_name}`)
              }}
            >
              Add Note
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                alert(`Create task for ${row.original.first_name} ${row.original.last_name}`)
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
                } else {
                  alert(`Add ${row.original.first_name} ${row.original.last_name} to deep search queue`)
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
  ], [onAddToGroup, onAddToCampaign, onAddToDeepSearch])

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Search state
  const [globalFilterColumn, setGlobalFilterColumn] = React.useState("first_name")
  const [globalFilterValue, setGlobalFilterValue] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [groupFilter, setGroupFilter] = React.useState("all")
  const [campaignFilter, setCampaignFilter] = React.useState("all")

  const table = useReactTable({
    data: prospects,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.linkedin_id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Handle global filter
  React.useEffect(() => {
    table.getColumn(globalFilterColumn)?.setFilterValue(globalFilterValue || "")
  }, [globalFilterColumn, globalFilterValue, table])

  // Handle status filter
  React.useEffect(() => {
    table.getColumn("status")?.setFilterValue(statusFilter === "all" ? "" : statusFilter)
  }, [statusFilter, table])

  // Handle group filter
  React.useEffect(() => {
    table.getColumn("in_group")?.setFilterValue(groupFilter === "all" ? "" : groupFilter)
  }, [groupFilter, table])

  // Handle campaign filter
  React.useEffect(() => {
    table.getColumn("in_campaign")?.setFilterValue(campaignFilter === "all" ? "" : campaignFilter)
  }, [campaignFilter, table])

  // Get unique values for filter dropdowns
  const uniqueStatuses = React.useMemo(() => {
    const statuses = prospects.map(p => p.status).filter(Boolean)
    return [...new Set(statuses)]
  }, [prospects])

  // Get unique group names
  const uniqueGroupNames = React.useMemo(() => {
    const groupNames = prospects
      .flatMap(p => p.groups || [])
      .map(g => g.name)
      .filter(Boolean)
    return [...new Set(groupNames)].sort()
  }, [prospects])

  // Get unique campaign names
  const uniqueCampaignNames = React.useMemo(() => {
    const campaignNames = prospects
      .flatMap(p => p.campaigns || [])
      .map(c => c.name)
      .filter(Boolean)
    return [...new Set(campaignNames)].sort()
  }, [prospects])

  // Available columns for global filtering (excluding already filtered columns)
  const filterableColumns = React.useMemo(() => [
    { value: "first_name", label: "Name" },
    { value: "last_name", label: "Last Name" },
    { value: "title", label: "Title" },
    { value: "email", label: "Email" },
    { value: "company_name", label: "Company" }
  ], [])

  const selectedRows = table.getFilteredSelectedRowModel().rows
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
        } else {
          alert(`Add ${selectedCount} prospects to deep search queue`)
        }
        break
      default:
        break
    }
  }

  if (!prospects || prospects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prospects found
      </div>
    )
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

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          {/* Global Filter */}
          <div className="flex items-center gap-2">
            <Select value={globalFilterColumn} onValueChange={setGlobalFilterColumn}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterableColumns.map((column) => (
                  <SelectItem key={column.value} value={column.value}>
                    {column.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={globalFilterValue}
                onChange={(e) => setGlobalFilterValue(e.target.value)}
                className="pl-8 w-full lg:w-48"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="text-sm font-medium whitespace-nowrap">
              Status:
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32" id="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="group-filter" className="text-sm font-medium whitespace-nowrap">
              Group:
            </Label>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-40" id="group-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="none">No Group</SelectItem>
                {uniqueGroupNames.map((groupName) => (
                  <SelectItem key={groupName} value={groupName}>
                    {groupName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="campaign-filter" className="text-sm font-medium whitespace-nowrap">
              Campaign:
            </Label>
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="w-40" id="campaign-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="none">No Campaign</SelectItem>
                {uniqueCampaignNames.map((campaignName) => (
                  <SelectItem key={campaignName} value={campaignName}>
                    {campaignName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
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
        )}
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
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="page-size" className="text-sm font-medium">
              Rows per page:
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="w-20" id="page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
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
        </div>
      </div>
    </div>
  )
}
