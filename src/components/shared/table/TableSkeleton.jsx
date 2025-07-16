import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from "@/lib/utils"

/**
 * Reusable table skeleton component for loading states
 * 
 * @param {Object} props
 * @param {string[]} props.headers - Array of column header labels (use empty string for icon/checkbox columns)
 * @param {number} props.rowCount - Number of skeleton rows to render (default: 5)
 * @param {string[]} props.cellWidths - Optional array of Tailwind width classes per column
 * @param {string} props.className - Additional CSS classes for the wrapper
 */
function TableSkeleton({
  headers = [],
  rowCount = 5,
  cellWidths = [],
  className,
  ...props
}) {
  // Generate default widths if not provided
  const defaultWidths = React.useMemo(() => {
    return headers.map((header, index) => {
      // Empty headers (checkboxes, icons) get small width
      if (!header || header === '') return 'w-8'
      
      // Special cases based on header content
      if (header.toLowerCase().includes('name')) return 'w-32'
      if (header.toLowerCase().includes('title')) return 'w-48'
      if (header.toLowerCase().includes('email')) return 'w-40'
      if (header.toLowerCase().includes('company')) return 'w-40'
      if (header.toLowerCase().includes('status')) return 'w-20'
      if (header.toLowerCase().includes('created')) return 'w-24'
      if (header.toLowerCase().includes('action')) return 'w-16'
      
      // Default for other columns
      return 'w-32'
    })
  }, [headers])

  const widths = cellWidths.length > 0 ? cellWidths : defaultWidths

  // Generate skeleton rows
  const rows = React.useMemo(() => {
    return Array.from({ length: rowCount }, (_, rowIndex) => (
      <TableRow key={rowIndex}>
        {headers.map((header, colIndex) => {
          const width = widths[colIndex] || 'w-32'
          
          // Determine skeleton height based on column type
          let height = 'h-4'
          if (header.toLowerCase().includes('status') || 
              header.toLowerCase().includes('prospects') ||
              header.toLowerCase().includes('badge')) {
            height = 'h-6'
          }
          if (header.toLowerCase().includes('action') || header === '') {
            height = 'h-8'
          }

          return (
            <TableCell key={colIndex}>
              <Skeleton className={cn(height, width)} />
            </TableCell>
          )
        })}
      </TableRow>
    ))
  }, [headers, rowCount, widths])

  return (
    <div className={cn("rounded-md border", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </div>
  )
}

export { TableSkeleton }
