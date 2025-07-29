import * as React from "react"
import { UsersIcon } from "lucide-react"

import { Badge } from '@/components/ui/badge'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { DataTable } from '@/components/shared/table/DataTable'

export default function CompaniesTable({ 
  data,
  total,
  query,
  onQueryChange,
  loading,
  onRowClick,
  onBulkDelete,
  onDelete,
  onUpdate
}) {

  // Column definitions (without select and actions - DataTable handles these)
  const columns = React.useMemo(() => [
    {
      accessorKey: "name",
      header: "Company Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name || '—'}
        </div>
      ),
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => (
        <div>
          {row.original.website ? (
            <a 
              href={row.original.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.original.website}
            </a>
          ) : (
            '—'
          )}
        </div>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="truncate" title={row.original.industry}>
            {row.original.industry || '—'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => (
        <div>
          {row.original.size || '—'}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="truncate" title={row.original.location}>
            {row.original.location || '—'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "prospects",
      header: "Prospects",
      enableSorting: false,
      cell: ({ row }) => {
        const prospects = row.original.prospects || []
        return (
          <TablePopoverCell
            items={prospects}
            icon={<UsersIcon />}
            triggerVariant="blue"
            title="Prospects"
            renderItem={(prospect) => (
              <div className="p-2 border rounded-md text-sm">
                <div className="font-medium">
                  {prospect.first_name} {prospect.last_name}
                </div>
                {prospect.title && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {prospect.title}
                  </p>
                )}
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
      label: "Delete Selected",
      value: "delete",
      variant: "destructive",
      onSelect: (selectedIds) => {
        if (onBulkDelete) {
          onBulkDelete(selectedIds)
        } else {
          alert(`Delete ${selectedIds.length} companies`)
        }
      }
    }
  ], [onBulkDelete])

  // Row actions function
  const rowActions = React.useCallback((ctx) => [
    {
      label: "Update",
      onSelect: () => onUpdate
        ? onUpdate(ctx.linkedin_id)
        : alert(`Update company ${ctx.name}`)
    },
    "separator",
    {
      label: "Delete",
      variant: "destructive",
      onSelect: () => onDelete
        ? onDelete(ctx.linkedin_id)
        : alert(`Delete company ${ctx.name}`)
    }
  ], [onUpdate, onDelete])

  // Row click handler
  const handleRowClick = React.useCallback((company) => {
    if (onRowClick) {
      onRowClick(company.linkedin_id)
    } else {
      alert(`row clicked '${company.linkedin_id}'`)
    }
  }, [onRowClick])

  return (
    <DataTable
      columns={columns}
      data={data || []}
      rowId={(row) => row.linkedin_id}
      loading={loading}
      emptyMessage="No companies found"
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
