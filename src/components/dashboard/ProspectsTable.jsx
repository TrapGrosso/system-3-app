import * as React from "react"
import {
  NotebookIcon, 
  CalendarIcon,
  ListIcon,
  TagsIcon,
  UsersIcon,
  FlagIcon
} from "lucide-react"

import { Badge } from '@/components/ui/badge'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { DataTable } from '@/components/shared/table/DataTable'

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
  data,
  total,
  query,
  onQueryChange,
  loading,
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

  // Column definitions (without select and actions - DataTable handles these)
  const columns = React.useMemo(() => [
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
      onQueryChange({ page: update.pageIndex + 1 })
    }
    if (update.pageSize !== undefined) {
      onQueryChange({ page_size: update.pageSize, page: 1 })
    }
  }, [onQueryChange])

  // Sorting state and handler
  const sorting = React.useMemo(() => [
    { id: query.sort_by, desc: query.sort_dir === 'desc' }
  ], [query.sort_by, query.sort_dir])

  const handleSortingChange = React.useCallback((updatedSorting) => {
    const newSorting = typeof updatedSorting === 'function' ? updatedSorting(sorting) : updatedSorting
    const s = newSorting[0] || {}
    onQueryChange({ 
      sort_by: s.id || 'created_at', 
      sort_dir: s.desc ? 'desc' : 'asc' 
    })
  }, [onQueryChange, sorting])

  // Bulk actions array
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

  // Row actions function
  const rowActions = React.useCallback((ctx) => [
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
  ], [onAddNote, onCreateTask, onAddToGroup, onAddToCampaign, onAddToDeepSearch])

  // Row click handler
  const handleRowClick = React.useCallback((prospect) => {
    if (onRowClick) {
      onRowClick(prospect.linkedin_id)
    } else {
      alert(`row clicked '${prospect.linkedin_id}'`)
    }
  }, [onRowClick])

  return (
    <DataTable
      columns={columns}
      data={data || []}
      rowId={(row) => row.linkedin_id}
      loading={loading}
      emptyMessage="No prospects found"
      mode="external"
      paginationState={paginationState}
      onPaginationChange={handlePaginationChange}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      manualSorting={true}
      bulkActions={bulkActions}
      rowActions={rowActions}
      onRowClick={handleRowClick}
    />
  )
}
