import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { 
  ChevronDownIcon, 
  MoreHorizontalIcon, 
  NotebookIcon, 
  CalendarIcon,
  ListIcon,
  TagsIcon,
  UsersIcon,
  FlagIcon
} from "lucide-react"

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
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { TableActionsDropdown } from '@/components/shared/table/TableActionsDropdown'
import { TableBulkActions } from '@/components/shared/table/TableBulkActions'
import { TableSkeleton } from '@/components/shared/table/TableSkeleton'

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
        return (
          <TablePopoverCell
            items={notes}
            icon={<NotebookIcon />}
            triggerVariant="blue"
            title="Notes"
            renderItem={(note) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="text-foreground">{note.body}</p>
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "tasks",
      header: "Tasks",
      cell: ({ row }) => {
        const tasks = row.original.tasks || []
        return (
          <TablePopoverCell
            items={tasks}
            icon={<CalendarIcon />}
            triggerVariant="green"
            title="Tasks"
            renderItem={(task) => (
              <div className="p-2 border rounded-md text-sm">
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
            )}
          />
        )
      },
    },
    {
      accessorKey: "variables",
      header: "Variables",
      cell: ({ row }) => {
        const variables = row.original.variables || []
        return (
          <TablePopoverCell
            items={variables}
            icon={<ListIcon />}
            triggerVariant="slate"
            title="Variables"
            renderItem={(variable) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="font-medium">{variable.name}</p>
                <p className="text-xs text-muted-foreground">{variable.value}</p>
                {variable.tags && variable.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {variable.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "enrichments",
      header: "Enrichments",
      cell: ({ row }) => {
        const enrichments = row.original.enrichments || []
        return (
          <TablePopoverCell
            items={enrichments}
            icon={<TagsIcon />}
            triggerVariant="slate"
            title="Enrichments"
            renderItem={(enrichment) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="font-medium">{enrichment.type}</p>
                {enrichment.prompt_name && (
                  <p className="text-xs text-muted-foreground">{enrichment.prompt_name}</p>
                )}
                <Badge variant="outline" className="text-xs mt-1">
                  {enrichment.entity_kind}
                </Badge>
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "groups",
      header: "Groups",
      cell: ({ row }) => {
        const groups = row.original.groups || []
        return (
          <TablePopoverCell
            items={groups}
            icon={<UsersIcon />}
            triggerVariant="slate"
            title="Groups"
            renderItem={(group) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="text-foreground">{group.name}</p>
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "campaigns",
      header: "Campaigns",
      cell: ({ row }) => {
        const campaigns = row.original.campaigns || []
        return (
          <TablePopoverCell
            items={campaigns}
            icon={<FlagIcon />}
            triggerVariant="slate"
            title="Campaigns"
            renderItem={(campaign) => (
              <div className="p-2 border rounded-md text-sm">
                <p className="text-foreground">{campaign.name}</p>
              </div>
            )}
          />
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const ctx = row.original
        return (
          <TableActionsDropdown
            context={ctx}
            items={[
              {
                label: "Add Note",
                onSelect: () => onAddNote
                  ? onAddNote(ctx.linkedin_id, ctx)
                  : alert(`Add note for ${ctx.first_name} ${ctx.last_name}`)
              },
              {
                label: "Create Task",
                onSelect: () => onCreateTask
                  ? onCreateTask(ctx.linkedin_id, ctx)
                  : alert(`Create task for ${ctx.first_name} ${ctx.last_name}`)
              },
              "separator",
              {
                label: "Add to Group",
                onSelect: () => onAddToGroup
                  ? onAddToGroup(ctx.linkedin_id)
                  : alert(`Add ${ctx.first_name} ${ctx.last_name} to group`)
              },
              {
                label: "Add to Campaign",
                onSelect: () => onAddToCampaign
                  ? onAddToCampaign(ctx.linkedin_id)
                  : alert(`Add ${ctx.first_name} ${ctx.last_name} to campaign`)
              },
              {
                label: "Add to Deep Search Queue",
                onSelect: () => onAddToDeepSearch?.(ctx.linkedin_id)
              },
              "separator",
              {
                label: "Delete",
                variant: "destructive",
                onSelect: () => alert(`Delete ${ctx.first_name} ${ctx.last_name}`)
              }
            ]}
          />
        )
      },
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

  // Define bulk actions array with handlers
  const bulkActions = React.useMemo(() => [
    {
      label: "Add to Group",
      value: "addToGroup",
      onSelect: (selectedIds) => {
        if (onBulkAddToGroup) {
          onBulkAddToGroup(selectedIds)
        } else {
          alert(`Add ${selectedIds.length} prospects to group`)
        }
      }
    },
    {
      label: "Add to Campaign", 
      value: "addToCampaign",
      onSelect: (selectedIds) => {
        if (onBulkAddToCampaign) {
          onBulkAddToCampaign(selectedIds)
        } else {
          alert(`Add ${selectedIds.length} prospects to campaign`)
        }
      }
    },
    {
      label: "Add to Deep Search Queue",
      value: "addToDeepSearch",
      onSelect: (selectedIds) => {
        if (onBulkAddToDeepSearch) {
          onBulkAddToDeepSearch(selectedIds)
        }
      }
    },
    "separator",
    {
      label: "Send Email",
      value: "email",
      onSelect: (selectedIds) => {
        alert(`Send email to ${selectedIds.length} prospects`)
      }
    },
    {
      label: "Export Selected",
      value: "export",
      onSelect: (selectedIds) => {
        alert(`Export ${selectedIds.length} prospects`)
      }
    },
    "separator",
    {
      label: "Delete Selected",
      value: "delete",
      variant: "destructive",
      onSelect: (selectedIds) => {
        alert(`Delete ${selectedIds.length} prospects`)
      }
    }
  ], [onBulkAddToGroup, onBulkAddToCampaign, onBulkAddToDeepSearch])

  const handleRowClick = (prospect) => {
    if (onRowClick) {
      onRowClick(prospect.linkedin_id)
    } else {
      alert(`row clicked '${prospect.linkedin_id}'`)
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

  // Show loading skeleton while loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        <TableBulkActions actions={['']}/>
        <TableSkeleton
          headers={[
            '', 'First Name', 'Last Name', 'Title', 'Status', 'Email',
            'Company', 'Notes', 'Tasks', 'Variables', 'Enrichments', 
            'Groups', 'Campaigns', ''
          ]}
          cellWidths={[
            'w-8', 'w-32', 'w-32', 'w-48', 'w-20', 'w-40',
            'w-40', 'w-8', 'w-8', 'w-8', 'w-8', 'w-8', 'w-8', 'w-16'
          ]}
          rowCount={10}
        />

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
      <TableBulkActions
        actions={bulkActions}
        selectedIds={selectedRows.map(row => row.original.linkedin_id)}
      />

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
