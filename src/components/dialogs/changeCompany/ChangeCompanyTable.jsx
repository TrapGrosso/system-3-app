import * as React from "react"
import { UsersIcon, ExternalLinkIcon } from "lucide-react"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { DataTable } from '@/components/shared/table/DataTable'

// Helper function to categorize company size
const getSizeCategory = (size) => {
  const numSize = parseInt(size) || 0
  if (numSize <= 50) return { label: "Small", variant: "default" }
  if (numSize <= 250) return { label: "Medium", variant: "secondary" }
  if (numSize <= 1000) return { label: "Large", variant: "outline" }
  return { label: "Enterprise", variant: "destructive" }
}

export default function ChangeCompanyTable({ 
  data,
  total,
  query,
  onQueryChange,
  loading,
  selectedId,
  onRowClick
}) {

  // Column definitions (same as CompaniesTable but no actions/selection)
  const columns = React.useMemo(() => [
    {
      accessorKey: "name",
      header: "Company Name",
      cell: ({ row }) => {
        const name = row.original.name || '—'
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium cursor-default">
                {name}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "website",
      header: "Website",
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          {row.original.website ? (
            <Button 
              variant="link" 
              asChild 
              className="h-auto p-0 text-left justify-start"
              onClick={(e) => e.stopPropagation()}
            >
              <a 
                href={row.original.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <span className="truncate max-w-[200px]">{row.original.website}</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </Button>
          ) : (
            '—'
          )}
        </div>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => {
        const industry = row.original.industry
        return industry ? (
          <Badge variant="secondary" className="max-w-xs">
            <span className="truncate">{industry}</span>
          </Badge>
        ) : (
          '—'
        )
      },
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        const size = row.original.size
        if (!size) return '—'
        
        const { label, variant } = getSizeCategory(size)
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={variant} className="cursor-default">
                {label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{size} employees</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const location = row.original.location || '—'
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-xs cursor-default">
                <div className="truncate">
                  {location}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{location}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "prospects",
      header: "Prospects",
      enableSorting: false,
      cell: ({ row }) => {
        const prospects = row.original.prospects || []
        return (
          <div className="flex items-center gap-2">
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
            <Badge variant="outline" className="text-xs">
              {prospects.length}
            </Badge>
          </div>
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

  // Row click handler
  const handleRowClick = React.useCallback((company) => {
    if (onRowClick) {
      onRowClick(company.linkedin_id, company)
    }
  }, [onRowClick])

  // Row className for selection highlight
  const rowClassName = React.useCallback((rowData) => {
    return rowData.linkedin_id === selectedId ? 'bg-accent/60' : ''
  }, [selectedId])

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
      enableSelection={false}
      bulkActions={[]}
      rowActions={undefined}
      onRowClick={handleRowClick}
      rowClassName={rowClassName}
    />
  )
}
