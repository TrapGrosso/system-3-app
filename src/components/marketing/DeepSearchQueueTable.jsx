import * as React from "react"
import { NotebookIcon, UsersIcon } from "lucide-react"

import { Badge } from '@/components/ui/badge'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { DataTable } from '@/components/shared/table/DataTable'

export default function DeepSearchQueueTable({ 
  queueItems = [],
  isLoading = false,
  isResolving = false,
  onChangePrompt,
  onRemove,
  onResolve,
  onRowClick,
}) {

  // Column definitions (without select and actions - DataTable handles these)
  const columns = React.useMemo(() => [
    {
      accessorKey: "prospect.first_name",
      header: "First Name",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.prospect?.first_name || '—'}
        </div>
      ),
    },
    {
      accessorKey: "prospect.last_name",
      header: "Last Name",
      enableSorting: false,
      cell: ({ row }) => (
        <div>{row.original.prospect?.last_name || '—'}</div>
      ),
    },
    {
      id: "prompts",
      header: "Prompts",
      enableSorting: false,
      cell: ({ row }) => {
        const prompts = row.original.prompts || []
        return (
          <TablePopoverCell
            items={prompts}
            icon={<NotebookIcon />}
            triggerVariant="blue"
            title={`Prompts (${prompts.length})`}
            renderItem={(prompt) => (
              <div className="p-2 border rounded-md text-sm">
                <div className="font-medium">{prompt.name}</div>
                {prompt.description && (
                  <div className="text-xs text-muted-foreground mt-1">{prompt.description}</div>
                )}
                {prompt.agent_type && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {prompt.agent_type}
                  </Badge>
                )}
              </div>
            )}
          />
        )
      },
    },
    {
      accessorKey: "groups",
      header: "Groups",
      enableSorting: false,
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
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : '—'}
        </div>
      ),
    },
  ], [])

  // Bulk actions array
  const bulkActions = React.useMemo(() => [
    {
      label: "Change Prompt",
      value: "changePrompt",
      onSelect: (selectedIds) => onChangePrompt(selectedIds)
    },
    {
      label: isResolving ? "Resolving..." : "Resolve Selected",
      value: "resolve",
      disabled: isResolving,
      onSelect: (selectedIds) => onResolve(selectedIds)
    },
    "separator",
    {
      label: "Remove Selected",
      value: "remove",
      variant: "destructive",
      onSelect: (selectedIds) => onRemove(selectedIds)
    }
  ], [onChangePrompt, onRemove, onResolve, isResolving])

  // Row actions function
  const rowActions = React.useCallback((item) => [
    {
      label: "Change Prompt",
      onSelect: () => onChangePrompt([item.id])
    },
    {
      label: isResolving ? "Resolving..." : "Resolve",
      disabled: isResolving,
      onSelect: () => onResolve([item.id])
    },
    "separator",
    {
      label: "Remove from Queue",
      variant: "destructive",
      onSelect: () => onRemove([item.id])
    }
  ], [onChangePrompt, onRemove, onResolve, isResolving])

  // Row click handler
  const handleRowClick = React.useCallback((item) => {
    if (onRowClick) {
      onRowClick(item.prospect?.linkedin_id || item.prospect_id)
    }
  }, [onRowClick])

  return (
    <DataTable
      columns={columns}
      data={queueItems}
      rowId={(row) => row.id}
      loading={isLoading}
      emptyMessage="No items in deep search queue"
      bulkActions={bulkActions}
      rowActions={rowActions}
      onRowClick={handleRowClick}
      // Internal pagination is the default mode
    />
  )
}
