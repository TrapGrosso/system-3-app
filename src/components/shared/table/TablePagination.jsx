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
  ...props
}) {
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
    <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", className)} {...props}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {enableSelection && <span>
          {selectedCount} of {total} row(s) selected.
        </span>}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Rows per page:
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-20" id="page-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm font-medium">
          Page {pageIndex + 1} of {pageCount}
        </div>

        {pageCount > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationPrevious 
                onClick={() => previousPage()}
                className={canPreviousPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              />
              
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
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
              ))}
              
              <PaginationNext 
                onClick={() => nextPage()}
                className={canNextPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
