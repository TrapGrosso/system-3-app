import * as React from "react"
import { Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import GroupFilters from "./GroupFilters"
import { formatAbsolute } from '@/utils/timeformat'
import { DataTable } from '@/components/shared/table/DataTable'

function GroupTable({ 
  groups = [], 
  isLoading, 
  isError, 
  onSelect, 
  selectedGroupId, 
  onEmpty, 
  onDelete, 
  onRefetch,
  isEmptyingGroup,
  isDeletingGroup,
  className 
}) {
  const [filter, setFilter] = React.useState(null)

  // Apply filtering
  const filteredGroups = React.useMemo(() => {
    if (!filter) return groups

    return groups.filter(group => {
      const { field, value } = filter
      
      switch (field) {
        case 'name':
          return group.name?.toLowerCase().includes(value.toLowerCase())
        case 'description':
          return group.description?.toLowerCase().includes(value.toLowerCase())
        default:
          return true
      }
    })
  }, [groups, filter])

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    // This effect is kept for consistency with the original implementation
    // DataTable handles pagination internally
  }, [filter])

  const handleFilterApply = (filterData) => {
    setFilter(filterData)
  }

  const handleFilterClear = () => {
    setFilter(null)
  }

  // Column definitions for DataTable
  const columns = React.useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.original.name || "";
        return (
          <div className="font-medium max-w-xs truncate" title={name}>
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description || "No description";
        return (
          <div className="max-w-sm">
            <Popover>
              <PopoverTrigger asChild>
                <div className="truncate text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors" title={description}>
                  {description}
                </div>
              </PopoverTrigger>
              <PopoverContent 
                align="start" 
                sideOffset={4}
                className="max-w-xs text-sm p-3"
              >
                <div className="whitespace-normal break-words">
                  {description}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
    {
      accessorKey: "prospect_count",
      header: "Prospects",
      meta: { align: 'right' },
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Badge variant="secondary">
            {row.original.prospect_count || 0}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      meta: { align: 'center' },
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground text-center">
          {formatAbsolute(row.original.created_at, { mode: "date", dateStyle: "short" })}
        </div>
      ),
    },
  ], [])

  // Row actions for DataTable
  const rowActions = React.useCallback((group) => [
    {
      label: "Empty group",
      onSelect: () => {
        if (!isEmptyingGroup && !isDeletingGroup) {
          onEmpty(group)
        }
      },
      disabled: isEmptyingGroup || isDeletingGroup
    },
    "separator",
    {
      label: "Delete group",
      variant: "destructive",
      onSelect: () => {
        if (!isEmptyingGroup && !isDeletingGroup) {
          onDelete(group)
        }
      },
      disabled: isEmptyingGroup || isDeletingGroup
    }
  ], [isEmptyingGroup, isDeletingGroup, onEmpty, onDelete])

  // Handle row click
  const handleRowClick = React.useCallback((group) => {
    onSelect(group)
  }, [onSelect])

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <DataTable
          columns={columns}
          data={[]}
          loading={true}
          enableSelection={false}
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`space-y-4 ${className}`}>
        <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="text-center py-8">
          <p className="text-sm text-destructive mb-2">Failed to load groups</p>
          <Button variant="outline" size="sm" onClick={onRefetch}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (filteredGroups.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">
            {filter ? 'No groups match your filter' : 'No groups found'}
          </p>
          <p className="text-xs text-muted-foreground">
            {filter ? 'Try adjusting your filter criteria' : 'Create your first group to get started'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <GroupFilters onApply={handleFilterApply} onClear={handleFilterClear} />

      {/* Table using DataTable */}
      <DataTable
        key={`groups-${filter?.field || 'all'}-${filter?.value || ''}`} // Reset pagination when filter changes
        columns={columns}
        data={filteredGroups}
        rowId={(group) => group.id}
        enableSelection={false}
        rowActions={rowActions}
        onRowClick={handleRowClick}
        rowClassName={(group) => selectedGroupId === group.id ? "bg-muted" : ""}
        emptyMessage={filter ? 'No groups match your filter' : 'No groups found'}
      />
    </div>
  )
}

export default GroupTable
