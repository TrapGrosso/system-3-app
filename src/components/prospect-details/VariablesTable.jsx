import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/table/DataTable'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { PlusIcon, PencilIcon, TrashIcon, Code2, ListIcon } from 'lucide-react'
import { useVariables } from '@/contexts/VariableContext'

export default function VariablesTable({ variables = [], prospect, onAddVariable, onVariablesChanged }) {
  const { deleteVariables, isDeletingVariable } = useVariables()

  const handleDeleteVariable = (variableId) => {
    deleteVariables([variableId])
    if (onVariablesChanged) {
      setTimeout(() => onVariablesChanged(), 100)
    }
  }

  const handleAddVariable = () => {
    if (onAddVariable) {
      onAddVariable()
    }
  }

  const getRowActions = (variable) => [
    {
      label: 'Edit',
      icon: PencilIcon,
      onSelect: () => handleAddVariable(),
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      variant: "destructive",
      disabled: isDeletingVariable,
      onSelect: () => handleDeleteVariable(variable.id),
    },
  ]

  const bulkActions = [
    {
      label: 'Delete selected',
      icon: TrashIcon,
      variant: "destructive",
      disabled: isDeletingVariable,
      onSelect: (ids) => {
        deleteVariables(ids)
        setTimeout(() => onVariablesChanged?.(), 100)
      },
    },
  ]

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
        <TablePopoverCell
          items={[row.original.value]}
          title={row.original.name}
          triggerVariant="accent"
          icon={<ListIcon />}
          renderItem={(value) => (
            <div className="p-2 border rounded-md text-sm">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {value}
              </p>
            </div>
          )}
        />
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

  if (variables.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Variables (0)
            </CardTitle>
            <Button onClick={handleAddVariable} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Variable
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No variables yet</p>
            <p className="text-sm">Add variables to store custom data for this prospect.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Variables ({variables.length})
          </CardTitle>
          <Button onClick={handleAddVariable} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Variable
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={variables}
          rowId={(row) => row.id}
          enableSelection={true}
          bulkActions={bulkActions}
          rowActions={getRowActions}
          emptyMessage="No variables found for this prospect"
          onBulkAction={(action, ids) => action.onClick(ids)}
          onRowClick={() => {}} // Disable row clicks
          pageSizes={[5, 10, 20]}
        />
      </CardContent>
    </Card>
  )
}
