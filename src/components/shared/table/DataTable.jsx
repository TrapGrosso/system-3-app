import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { TableBulkActions } from './TableBulkActions'
import { TableSkeleton } from './TableSkeleton'
import { TablePagination } from './TablePagination'
import { TableActionsDropdown } from './TableActionsDropdown'
import { SortIcon } from './SortIcon'

/**
 * Generic reusable data table component that handles all common table functionality
 * 
 * @param {Object} props
 * @param {Array} props.columns - TanStack table column definitions (without select/actions columns)
 * @param {Array} props.data - Array of data to display
 * @param {Function} props.rowId - Function to get unique ID from row: (row) => string|number
 * @param {boolean} props.loading - Show loading skeleton
 * @param {string} props.emptyMessage - Message when no data
 * @param {boolean} props.enableSelection - Add selection checkbox column (default: true)
 * @param {Array} props.bulkActions - Bulk actions array for TableBulkActions
 * @param {Function} props.rowActions - Function returning row actions: (rowData) => ActionItem[]
 * @param {Function} props.onRowClick - Row click handler: (rowData) => void
 * @param {string} props.mode - Pagination mode: "internal" | "external" (default: "internal")
 * @param {Object} props.paginationState - External pagination state: { pageIndex, pageSize, pageCount, totalElements }
 * @param {Function} props.onPaginationChange - External pagination handler: (update) => void
 * @param {Array} props.pageSizes - Available page sizes (default: [10, 20, 30, 50])
 * @param {Array} props.sorting - External sorting state for TanStack table
 * @param {Function} props.onSortingChange - External sorting handler
 * @param {boolean} props.manualSorting - Enable manual sorting
 * @param {Function} props.rowClassName - Function to get row className: (rowData) => string
 */
export function DataTable({
  // Core props
  columns = [],
  data = [],
  rowId,
  loading = false,
  emptyMessage = "No results found",
  
  // Selection & bulk actions
  enableSelection = true,
  bulkActions = [],
  onBulkAction,
  
  // Row actions
  rowActions,
  onRowClick,
  
  // Pagination
  mode = "internal",
  paginationState,
  onPaginationChange,
  pageSizes = [10, 20, 30, 50],
  
  // Sorting
  sorting,
  onSortingChange,
  manualSorting = false,
  
  // Styling
  className,
  headerClassName,
  bodyClassName,
  rowClassName,
  
  ...props
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Build final columns array with selection and actions
  const finalColumns = React.useMemo(() => {
    const cols = [...columns]
    
    // Add selection column if enabled
    if (enableSelection) {
      cols.unshift({
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => e.stopPropagation()}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      })
    }
    
    // Add actions column if rowActions provided
    if (rowActions) {
      cols.push({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const actions = rowActions(row.original)
          return (
            <TableActionsDropdown
              items={actions}
              context={row.original}
            />
          )
        },
        enableSorting: false,
        enableHiding: false,
      })
    }
    
    return cols
  }, [columns, enableSelection, rowActions])

  // Determine table configuration based on mode
  const isExternal = mode === 'external'
  const tableConfig = {
    data,
    columns: finalColumns,
    state: {
      rowSelection,
      ...(isExternal ? {} : { pagination: internalPagination }),
      ...(sorting ? { sorting } : {}),
    },
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    ...(rowId ? { getRowId: rowId } : {}),
    ...(manualSorting ? { manualSorting: true } : {}),
    ...(onSortingChange ? { onSortingChange } : {}),
    ...(!isExternal ? { 
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setInternalPagination 
    } : {}),
  }

  const table = useReactTable(tableConfig)

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const selectedIds = selectedRows.map(row => rowId ? rowId(row.original) : row.id)

  const handleRowClick = (rowData) => {
    if (onRowClick) {
      onRowClick(rowData)
    }
  }

  // Render sortable header with click handler and sort icon
  const renderHeader = (header) => {
    if (header.isPlaceholder) return null
    
    const canSort = header.column.getCanSort()
    const headerContent = flexRender(header.column.columnDef.header, header.getContext())
    const meta = header.column.columnDef.meta
    const align = meta?.align || 'left'
    
    if (!canSort) {
      return headerContent
    }
    
    const justifyClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
    
    return (
      <button
        className={`w-full flex items-center hover:text-foreground transition-colors ${justifyClass}`}
        onClick={header.column.getToggleSortingHandler()}
        type="button"
      >
        {headerContent}
        <SortIcon direction={header.column.getIsSorted()} />
      </button>
    )
  }

  // Generate skeleton headers from columns
  const skeletonHeaders = React.useMemo(() => {
    return finalColumns.map(col => {
      if (col.id === 'select' || col.id === 'actions') return ''
      return typeof col.header === 'string' ? col.header : col.accessorKey || ''
    })
  }, [finalColumns])

  // Show loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <TableBulkActions actions={bulkActions} selectedIds={[]} />
        <TableSkeleton
          headers={skeletonHeaders}
          rowCount={10}
        />
        <div className="opacity-50 pointer-events-none">
          <TablePagination
            table={table}
            totalRows={0}
            selectedCount={0}
            mode={mode}
            pageSizes={pageSizes}
          />
        </div>
      </div>
    )
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className || ''}`} {...props}>
      {/* Bulk Actions */}
      {enableSelection && (
        <TableBulkActions
          actions={bulkActions}
          selectedIds={selectedIds}
          onAction={onBulkAction}
        />
      )}

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className={headerClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  const align = meta?.align || 'left'
                  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
                  const headerClassNames = [alignClass, meta?.headerClassName].filter(Boolean).join(' ')
                  
                  return (
                    <TableHead key={header.id} className={headerClassNames}>
                      {renderHeader(header)}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={bodyClassName}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`cursor-pointer ${
                    typeof rowClassName === 'function'
                      ? rowClassName(row.original)
                      : typeof rowClassName === 'string'
                        ? rowClassName
                        : ''
                  }`.trim()}
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
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta
                    const align = meta?.align || 'left'
                    const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
                    const cellClassNames = [alignClass, meta?.cellClassName].filter(Boolean).join(' ')
                    
                    return (
                      <TableCell key={cell.id} className={cellClassNames}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TablePagination
        enableSelection={enableSelection}
        table={table}
        totalRows={isExternal ? paginationState?.totalElements || paginationState?.pageCount * paginationState?.pageSize : data.length}
        selectedCount={selectedCount}
        mode={mode}
        paginationState={paginationState}
        onPageIndexChange={isExternal ? (index) => onPaginationChange?.({ pageIndex: index }) : undefined}
        onPageSizeChange={isExternal ? (size) => onPaginationChange?.({ pageSize: size }) : undefined}
        pageSizes={pageSizes}
      />
    </div>
  )
}
