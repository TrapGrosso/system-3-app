import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/table/DataTable'
import { PlusIcon } from 'lucide-react'

export default function VariablesTable({ variables = [], prospect }) {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="max-w-sm truncate">
          {row.getValue("value")}
        </div>
      ),
    },
    {
      accessorKey: "enrichment_ids",
      header: "Enrichments",
      enableSorting: false,
      cell: ({ row }) => {
        const enrichmentIds = row.getValue("enrichment_ids")
        const count = enrichmentIds?.length || 0
        
        return (
          <div className="text-sm text-muted-foreground">
            {count} enrichment{count !== 1 ? 's' : ''}
          </div>
        )
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Variables</CardTitle>
          <Button size="sm" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Variable
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={variables}
          rowId={(row) => row.id}
          emptyMessage="No variables found for this prospect"
          enableSelection={false}
          pageSizes={[5, 10, 20]}
        />
      </CardContent>
    </Card>
  )
}
