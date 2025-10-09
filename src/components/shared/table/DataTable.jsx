import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
 * Generic reusable data table component that handles common table functionality.
 *
 * Rendering precedence (highest to lowest):
 * 1) loading === true -> show skeleton
 * 2) error === true -> show errorMessage
 * 3) data is empty -> show emptyMessage
 * 4) render table
 *
 * Column meta options supported by this table:
 * - meta.align: 'left' | 'center' | 'right' (controls header and cell text alignment)
 * - meta.headerClassName: string (applied to TableHead)
 * - meta.cellClassName: string (applied to TableCell)
 *
 * @typedef {'left'|'center'|'right'} ColumnAlign
 *
 * @typedef {Object} ColumnMeta
 * @property {ColumnAlign} [align='left'] - Text alignment for header and cells
 * @property {string} [headerClassName] - Extra class for header cell
 * @property {string} [cellClassName] - Extra class for body cells
 *
 * @typedef {Object} RowAction
 * @property {string} label - Visible label of the action item
 * @property {function(Object): void} onSelect - Handler invoked with the current row's original data
 * @property {string} [variant] - Optional visual variant (e.g. 'destructive'); rendering depends on UI implementation
 *
 * @typedef {'separator'} ActionSeparator
 *
 * @typedef {RowAction|ActionSeparator} RowActionItem
 *
 * @typedef {Object} BulkAction
 * @property {string} label - Visible label of the bulk action
 * @property {string} value - Unique identifier for the bulk action
 * @property {function(string[]): void} [onSelect] - Optional handler invoked with selected row IDs; if omitted and onBulkAction is provided, onBulkAction(value, selectedIds) will be called
 * @property {string} [variant] - Optional visual variant (e.g. 'destructive')
 *
 * @typedef {'separator'} BulkActionSeparator
 *
 * @typedef {BulkAction|BulkActionSeparator} BulkActionItem
 *
 * @param {Object} props
 * @param {Array<Object>} props.columns - TanStack table column definitions (without select/actions columns); each column can include a `meta` object per ColumnMeta
 * @param {Array<Object>} props.data - Array of data to display
 * @param {function(Object): (string|number)} props.rowId - Function to get unique ID from a row
 * @param {boolean} [props.loading=false] - Show loading skeleton
 * @param {boolean} [props.error=false] - Show error state when true (docs-only addition; implement alongside UI when ready)
 * @param {string} [props.errorMessage="Something went wrong"] - Message when error is true
 * @param {string} [props.emptyMessage="No results found"] - Message when no data
 * @param {boolean} [props.enableSelection=true] - Add selection checkbox column
 * @param {Array<BulkActionItem>} [props.bulkActions=[]] - Bulk actions configuration
 * @param {function(string, string[]): void} [props.onBulkAction] - Optional fallback bulk handler invoked as onBulkAction(value, selectedIds) when an action item has no onSelect
 * @param {function(Object): Array<RowActionItem>} [props.rowActions] - Function returning row actions for TableActionsDropdown
 * @param {function(Object): void} [props.onRowClick] - Row click handler, invoked with rowData
 * @param {'internal'|'external'} [props.mode="internal"] - Pagination mode
 * @param {{ pageIndex: number, pageSize: number, pageCount?: number, totalElements?: number }} [props.paginationState] - External pagination state
 * @param {function(Object): void} [props.onPaginationChange] - External pagination update handler: e.g. ({ pageIndex }) or ({ pageSize })
 * @param {Array<number>} [props.pageSizes=[10, 20, 30, 50]] - Available page sizes
 * @param {Object} [props.paginationAllOption] - Configuration for 'All' page size option
 * @param {boolean} [props.paginationAllOption.enabled=false] - Whether to enable the 'All' option
 * @param {string} [props.paginationAllOption.label='All'] - Label for the 'All' option
 * @param {string|number} [props.paginationAllOption.externalValue='all'] - Value to send to backend in external mode
 * @param {Array<Object>} [props.sorting] - External sorting state for TanStack table
 * @param {function(Function|Array<Object>): void} [props.onSortingChange] - External sorting handler
 * @param {boolean} [props.manualSorting=false] - Enable manual sorting (for server-driven sort)
 * @param {string|function(Object): string} [props.rowClassName] - Static className or function mapping rowData -> className
 * @param {string} [props.className] - Container className
 * @param {string} [props.headerClassName] - TableHeader className
 * @param {string} [props.bodyClassName] - TableBody className
 *
 * @example
 * // Minimal usage with internal pagination and selection
 * const columns = [
 *   {
 *     accessorKey: 'first_name',
 *     header: 'First Name',
 *     cell: ({ row }) => row.original.first_name ?? '—',
 *     meta: { align: 'left' }
 *   },
 *   {
 *     accessorKey: 'last_name',
 *     header: 'Last Name',
 *     cell: ({ row }) => row.original.last_name ?? '—',
 *     meta: { align: 'left' }
 *   },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={rows}
 *   rowId={(r) => r.id}
 * />
 *
 * @example
 * // External pagination and sorting + error handling
 * const paginationState = {
 *   pageIndex: query.page - 1,
 *   pageSize: query.page_size,
 *   pageCount: Math.ceil(total / query.page_size),
 *   totalElements: total
 * };
 *
 * const sorting = [{ id: query.sort_by, desc: query.sort_dir === 'desc' }];
 *
 * const handlePaginationChange = (update) => {
 *   if (update.pageIndex != null) setQuery({ page: update.pageIndex + 1 });
 *   if (update.pageSize != null) setQuery({ page_size: update.pageSize, page: 1 });
 * };
 *
 * const handleSortingChange = (next) => {
 *   const s = (typeof next === 'function' ? next(sorting) : next)[0] || {};
 *   setQuery({ sort_by: s.id || 'created_at', sort_dir: s.desc ? 'desc' : 'asc' });
 * };
 *
 * <DataTable
 *   columns={columns}
 *   data={rows}
 *   rowId={(r) => r.id}
 *   loading={isLoading}
 *   error={Boolean(loadError)}
 *   errorMessage={loadError?.message || 'Failed to load data'}
 *   mode="external"
 *   paginationState={paginationState}
 *   onPaginationChange={handlePaginationChange}
 *   sorting={sorting}
 *   onSortingChange={handleSortingChange}
 *   manualSorting
 * />
 *
 * @example
 * // Bulk actions – per-action onSelect
 * const bulkActions = [
 *   {
 *     label: 'Export Selected',
 *     value: 'export',
 *     onSelect: (selectedIds) => exportIds(selectedIds)
 *   },
 *   'separator',
 *   {
 *     label: 'Delete Selected',
 *     value: 'delete',
 *     variant: 'destructive',
 *     onSelect: (selectedIds) => deleteIds(selectedIds)
 *   }
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={rows}
 *   rowId={(r) => r.id}
 *   enableSelection
 *   bulkActions={bulkActions}
 * />
 *
 * @example
 * // Bulk actions – using global onBulkAction when an item has no onSelect
 * const bulkActions = [
 *   { label: 'Add to Group', value: 'addToGroup' },
 *   'separator',
 *   { label: 'Delete', value: 'delete', variant: 'destructive' }
 * ];
 *
 * const onBulkAction = (value, selectedIds) => {
 *   switch (value) {
 *     case 'addToGroup':
 *       return openGroupDialog(selectedIds);
 *     case 'delete':
 *       return deleteIds(selectedIds);
 *     default:
 *       return;
 *   }
 * };
 *
 * <DataTable
 *   columns={columns}
 *   data={rows}
 *   rowId={(r) => r.id}
 *   enableSelection
 *   bulkActions={bulkActions}
 *   onBulkAction={onBulkAction}
 * />
 *
 * @example
 * // Row actions – with a separator
 * const rowActions = (row) => ([
 *   { label: 'View', onSelect: (r) => openDetails(r) },
 *   'separator',
 *   { label: 'Delete', variant: 'destructive', onSelect: (r) => deleteOne(r) }
 * ]);
 *
 * <DataTable
 *   columns={columns}
 *   data={rows}
 *   rowId={(r) => r.id}
 *   rowActions={rowActions}
 * />
 */
 
export function DataTable({
  // Core props
  columns = [],
  data = [],
  rowId,
  loading = false,
  error = false,
  errorMessage = "Something went wrong",
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
  paginationAllOption,
  
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
  const [internalSorting, setInternalSorting] = React.useState([])

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
      sorting: sorting ?? internalSorting,
    },
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(rowId ? { getRowId: rowId } : {}),
    ...(manualSorting ? { manualSorting: true } : {}),
    onSortingChange: onSortingChange ?? setInternalSorting,
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

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <TableBulkActions actions={bulkActions} selectedIds={[]} />
        <div role="alert" aria-live="polite" className="text-center py-8 text-destructive">
          {errorMessage}
        </div>
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
        pageSizes={paginationAllOption?.enabled 
          ? [...pageSizes, { value: 'all', label: paginationAllOption.label || 'All' }] 
          : pageSizes}
        allValueForExternal={paginationAllOption?.externalValue || 'all'}
      />
    </div>
  )
}
