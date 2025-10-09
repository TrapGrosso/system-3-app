import * as React from "react"
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
import { cn } from "@/lib/utils"

/**
 * Reusable table pagination component that works with TanStack Table
 * Supports both server-side (manual) and client-side pagination
 * 
 * @typedef {Object} PageSizeOption
 * @property {number|string} value - The value for the page size ('all' for showing all items)
 * @property {string} [label] - The label to display for this option
 */

/**
 * Reusable table pagination component that works with TanStack Table
 * Supports both server-side (manual) and client-side pagination
 * 
 * @param {Object} props
 * @param {Object} props.table - TanStack table instance
 * @param {number} [props.totalRows] - Total number of rows
 * @param {number} [props.selectedCount=0] - Number of selected rows
 * @param {Array<number|PageSizeOption|string>} [props.pageSizes=[10, 20, 30, 50]] - Available page sizes
 * @param {boolean} [props.enableSelection] - Whether selection is enabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {'internal'|'external'} [props.mode='internal'] - Pagination mode
 * @param {Object} [props.paginationState] - External pagination state
 * @param {number} props.paginationState.pageIndex - Current page index
 * @param {number|string} props.paginationState.pageSize - Current page size
 * @param {number} props.paginationState.pageCount - Total number of pages
 * @param {function(number): void} [props.onPageIndexChange] - External page index change handler
 * @param {function(number|string): void} [props.onPageSizeChange] - External page size change handler
 * @param {string|number} [props.allValueForExternal='all'] - Value to send to backend when 'All' is selected in external mode
 */
export function TablePagination({
  table,
  totalRows,
  selectedCount = 0,
  pageSizes = [10, 20, 30, 50],
  enableSelection,
  className,
  // External mode props
  mode = 'internal',
  paginationState,
  onPageIndexChange,
  onPageSizeChange,
  // New prop for external mode 'All' value
  allValueForExternal = 'all',
  ...props
}) {
  // Normalize pageSizes to array of objects with value and label
  const normalizedPageSizes = React.useMemo(() => {
    return pageSizes.map(size => {
      if (typeof size === 'object' && size !== null) {
        return {
          value: size.value,
          label: size.label || (size.value === 'all' ? 'All' : String(size.value))
        }
      }
      if (size === 'all') {
        return { value: 'all', label: 'All' }
      }
      return { value: size, label: String(size) }
    })
  }, [pageSizes])

  // Determine pagination values based on mode
  const isExternal = mode === 'external'
  
  const pageIndex = isExternal ? paginationState?.pageIndex ?? 0 : table.getState().pagination.pageIndex
  const pageSize = isExternal ? paginationState?.pageSize ?? 10 : table.getState().pagination.pageSize
  const pageCount = isExternal ? paginationState?.pageCount ?? 1 : table.getPageCount()
  
  const canPreviousPage = isExternal ? pageIndex > 0 : table.getCanPreviousPage()
  const canNextPage = isExternal ? pageIndex < pageCount - 1 : table.getCanNextPage()


  // Use provided totalRows or fallback to table data length
  const total = totalRows ?? (table ? table.getPrePaginationRowModel().rows.length : 0)
  
  // Pagination handlers based on mode
  const setPageIndex = isExternal 
    ? (index) => onPageIndexChange?.(index)
    : (index) => table.setPageIndex(index)
    
  const setPageSize = isExternal
    ? (size) => onPageSizeChange?.(size)
    : (size) => table.setPageSize(size)
    
  const previousPage = isExternal
    ? () => setPageIndex(Math.max(0, pageIndex - 1))
    : () => table.previousPage()
    
  const nextPage = isExternal
    ? () => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))
    : () => table.nextPage()

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(0, pageIndex - delta); 
         i <= Math.min(pageCount - 1, pageIndex + delta); 
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

    if (range[range.length - 1] < pageCount - 2) {
      if (range[range.length - 1] < pageCount - 3) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(pageCount - 1)
    }

    return rangeWithDots
  }

  return (
    <div
      className={cn(
        "grid w-full gap-3 grid-cols-1 md:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* Left column */}
      <div className="flex flex-col gap-2 w-full">
        {/* Top: selected count label (full width) */}
        <div className="text-sm text-muted-foreground w-full">
          {enableSelection ? `${selectedCount} of ${total} row(s) selected.` : ""}
        </div>

        {/* Bottom: wrap-enabled row containing selector + page info */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full min-w-0">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Label htmlFor="page-size" className="text-sm font-medium">
              Rows per page:
            </Label>
            <Select
              value={typeof pageSize === 'string' ? pageSize : `${pageSize}`}
              onValueChange={(value) => {
                // Handle 'all' option differently
                if (value === 'all') {
                  if (isExternal) {
                    // For external mode, send the configured allValueForExternal
                    onPageSizeChange?.(allValueForExternal)
                    // Reset to first page when changing to 'all'
                    onPageIndexChange?.(0)
                  } else {
                    // For internal mode, set page size to total rows
                    table.setPageSize(total)
                    table.setPageIndex(0)
                  }
                } else {
                  const numericValue = Number(value)
                  setPageSize(numericValue)
                  // Reset to first page when changing page size
                  if (isExternal) {
                    onPageIndexChange?.(0)
                  } else {
                    table.setPageIndex(0)
                  }
                }
              }}
            >
              <SelectTrigger className="w-20" id="page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {normalizedPageSizes.map((size) => (
                  <SelectItem key={size.value} value={String(size.value)}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm font-medium whitespace-normal break-words">
            Page {pageIndex + 1} of {pageCount}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="w-full flex justify-center">
        {pageCount > 1 && (
          <Pagination className={'md:justify-end'}>
            <PaginationContent className="flex-wrap justify-start lg:justify-end">
              <PaginationPrevious
                onClick={canPreviousPage ? () => previousPage() : undefined}
                className={canPreviousPage ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
              />
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === pageIndex}
                      onClick={() => setPageIndex(page)}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationNext
                onClick={canNextPage ? () => nextPage() : undefined}
                className={canNextPage ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
