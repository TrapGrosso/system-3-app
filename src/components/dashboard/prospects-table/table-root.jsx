import * as React from "react"
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { columns } from './columns'
import { Filters } from './filters'
import { BulkActions } from './bulk-actions'
import { DataTable } from './data-table'
import { TablePagination } from './pagination'

export default function ProspectsTable({ prospects = [], onRowClick }) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Search state
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [locationFilter, setLocationFilter] = React.useState("all")

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

  // Handle search filter
  React.useEffect(() => {
    table.getColumn("first_name")?.setFilterValue(globalFilter)
  }, [globalFilter, table])

  // Handle status filter
  React.useEffect(() => {
    table.getColumn("status")?.setFilterValue(statusFilter === "all" ? "" : statusFilter)
  }, [statusFilter, table])

  // Handle location filter
  React.useEffect(() => {
    table.getColumn("location")?.setFilterValue(locationFilter === "all" ? "" : locationFilter)
  }, [locationFilter, table])

  // Get unique values for filter dropdowns
  const uniqueStatuses = React.useMemo(() => {
    const statuses = prospects.map(p => p.status).filter(Boolean)
    return [...new Set(statuses)]
  }, [prospects])

  const uniqueLocations = React.useMemo(() => {
    const locations = prospects.map(p => p.location).filter(Boolean)
    return [...new Set(locations)]
  }, [prospects])

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkAction = (action) => {
    const selectedProspects = selectedRows.map(row => row.original)
    const selectedCount = selectedRows.length
    
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Filters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          uniqueStatuses={uniqueStatuses}
          uniqueLocations={uniqueLocations}
        />
        <BulkActions
          selectedRows={selectedRows}
          onBulkAction={handleBulkAction}
        />
      </div>

      <DataTable table={table} onRowClick={onRowClick} />
      
      <TablePagination table={table} />
    </div>
  )
}
