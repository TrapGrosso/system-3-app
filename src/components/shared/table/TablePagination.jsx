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
  className,
  ...props
}) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()
  const canPreviousPage = table.getCanPreviousPage()
  const canNextPage = table.getCanNextPage()

  // Use provided totalRows or fallback to table data length
  const total = totalRows ?? table.getPrePaginationRowModel().rows.length

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
        <span>
          {selectedCount} of {total} row(s) selected.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Rows per page:
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
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
                onClick={() => table.previousPage()}
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
                      onClick={() => table.setPageIndex(page)}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              <PaginationNext 
                onClick={() => table.nextPage()}
                className={canNextPage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
