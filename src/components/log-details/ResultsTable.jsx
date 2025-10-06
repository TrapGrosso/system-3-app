import React from 'react'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/table/DataTable'
import { UserIcon, CalendarIcon, BuildingIcon, TableIcon } from 'lucide-react'
import { formatAbsolute } from '@/utils/timeformat'

export default function ResultsTable({ results = [], onRowClick = () => {} }) {

  const columns = [
    {
      header: 'Success',
      accessorKey: 'success',
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant={row.original.success ? 'default' : 'destructive'}>
          {row.original.success ? 'Success' : 'Failed'}
        </Badge>
      ),
    },
    {
      header: 'First Name',
      accessorKey: 'first_name',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.first_name || '—'}
        </span>
      ),
    },
    {
      header: 'Last Name',
      accessorKey: 'last_name',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.last_name || '—'}
        </span>
      ),
    },
    {
      header: 'Company',
      accessorKey: 'company_name',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BuildingIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {row.original.company_name || '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          {formatAbsolute(row.original.created_at, { dateStyle: "short", timeStyle: "short" })}
        </div>
      ),
    },
  ]

  if (results.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center text-muted-foreground">
          <TableIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No results available</p>
          <p className="text-sm mt-1">Results from this log will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={results}
      rowId={(row) => row.prospect_id}
      enableSelection={false}
      emptyMessage="No results found"
      pageSizes={[10, 20, 30]}
      onRowClick={onRowClick}
    />
  )
}
