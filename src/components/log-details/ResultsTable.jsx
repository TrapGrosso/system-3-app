import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/table/DataTable'
import { UserIcon, CalendarIcon, BuildingIcon, TableIcon } from 'lucide-react'

export default function ResultsTable({ results = [] }) {
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns = [
    {
      header: 'Prospect ID',
      accessorKey: 'prospect_id',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-mono text-sm">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          {row.original.prospect_id}
        </div>
      ),
    },
    {
      header: 'Success',
      accessorKey: 'success',
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant={row.original.success ? 'default' : 'destructive'}>
          {row.original.success ? 'Success' : 'Failed'}
        </Badge>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(row.original.created_at)}
        </div>
      ),
    },
    {
      header: 'First Name',
      accessorKey: 'prospect.first_name',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.prospect?.first_name || '—'}
        </span>
      ),
    },
    {
      header: 'Last Name',
      accessorKey: 'prospect.last_name',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.prospect?.last_name || '—'}
        </span>
      ),
    },
    {
      header: 'Company',
      accessorKey: 'prospect.company.name',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BuildingIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {row.original.prospect?.company?.name || '—'}
          </span>
        </div>
      ),
    },
  ]

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            Results ({results.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <TableIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results available</p>
            <p className="text-sm mt-1">Results from this log will appear here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="h-5 w-5" />
          Results ({results.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={results}
          rowId={(row) => row.prospect_id}
          enableSelection={false}
          emptyMessage="No results found"
          pageSizes={[10, 20, 30]}
          initialState={{
            sorting: [{ id: 'created_at', desc: true }]
          }}
        />
      </CardContent>
    </Card>
  )
}
