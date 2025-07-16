import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  NotebookIcon, 
  CalendarIcon,
  ListIcon,
  TagsIcon,
  UsersIcon,
  FlagIcon
} from "lucide-react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useProspects } from '@/contexts/ProspectsContext'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { TableActionsDropdown } from '@/components/shared/table/TableActionsDropdown'
import { TableBulkActions } from '@/components/shared/table/TableBulkActions'
import { TableSkeleton } from '@/components/shared/table/TableSkeleton'
import { TablePagination } from '@/components/shared/table/TablePagination'

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

  const table = useReactTable({
    data: prospects,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    getRowId: (row) => row.linkedin_id,
    enableRowSelection: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (sorting) => {
      const s = sorting[0] || {}
      setQuery({ 
        sort_by: s.id || 'created_at', 
        sort_dir: s.desc ? 'desc' : 'asc' 
      })
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
        <div className="opacity-50 pointer-events-none">
          <TablePagination
            table={table}
            totalRows={0}
            selectedCount={0}
          />
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
      <TablePagination
        mode="external"
        paginationState={{ 
          pageIndex: pageIndex, 
          pageSize: pageSize, 
          pageCount: Math.ceil(total / pageSize) 
        }}
        onPageIndexChange={(index) => setQuery({ page: index + 1 })}
        onPageSizeChange={(size) => setQuery({ page_size: size, page: 1 })}
        totalRows={total}
        selectedCount={selectedCount}
      />
    </div>
  )
}
