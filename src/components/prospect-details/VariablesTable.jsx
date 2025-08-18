import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/table/DataTable'
import { TablePopoverCell } from '@/components/shared/table/TablePopoverCell'
import { PlusIcon, PencilIcon, TrashIcon, Code2, ListIcon } from 'lucide-react'
import { useVariables } from '@/contexts/VariableContext'
import DeleteDialog from '@/components/dialogs/DeleteDialog'
import useDeleteDialog from '@/components/shared/dialog/useDeleteDialog'

export default function VariablesTable({ variables = [], prospect, onAddVariable, onVariablesChanged }) {
  const { deleteVariables, isDeletingVariable } = useVariables()

  const {
    openDialog: openDeleteDialog,
    currentItem: variableToDelete,
    DeleteDialogProps
  } = useDeleteDialog(
    async (variable) => await deleteVariables([variable.id]),
    onVariablesChanged
  )

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
      onSelect: () => openDeleteDialog(variable),
    },
  ]

  const bulkActions = [
    {
      label: 'Delete selected',
      icon: TrashIcon,
      variant: "destructive",
      disabled: isDeletingVariable,
      onSelect: async (ids) => {
        await deleteVariables(ids)
        onVariablesChanged?.()
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
// New Prompt column
    {
      accessorKey: "prompt",
      header: "Prompt",
      enableSorting: false,
      cell: ({ row }) => {
        const prompt = row.original?.prompt
        const items = prompt ? [prompt] : []
        return (
          <TablePopoverCell
            items={items}
            title="Variable Prompt"
            icon={<Code2 />}
            triggerVariant="accent"
            maxHeight={240}
            renderItem={(p) => (
              <div className="p-2 border rounded-md text-sm space-y-1">
                <div className="font-medium">{p.name}</div>
                {p.agent_type && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Agent Type:</span>
                    <Badge variant="outline">{p.agent_type}</Badge>
                  </div>
                )}
              </div>
            )}
          />
        )
      },
    },
    // New Enrichments column
    {
      accessorKey: "enrichments",
      header: "Enrichments",
      enableSorting: false,
      cell: ({ row }) => {
        const v = row.original
        const items = Array.isArray(v.enrichments) ? v.enrichments : []

        if (items.length > 0) {
          return (
            <TablePopoverCell
              items={items}
              title="Enrichments"
              icon={<ListIcon />}
              triggerVariant="accent"
              maxHeight={320}
              renderItem={(enrichment) => (
                <div className="p-2 border rounded-md text-sm space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{enrichment.type}</Badge>
                    {enrichment.source && <Badge variant="outline">{enrichment.source}</Badge>}
                  </div>
                  {enrichment.prompt ? (
                    <div className="bg-muted/40 rounded-md p-2 space-y-1">
                      <div className="text-xs text-muted-foreground">Prompt</div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm">{enrichment.prompt.name}</span>
                        {enrichment.prompt.agent_type && (
                          <Badge variant="outline">{enrichment.prompt.agent_type}</Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">No enrichment prompt</div>
                  )}
                </div>
              )}
            />
          )
        } else {
          return <div className="text-center text-muted-foreground">—</div>
        }
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

      {variableToDelete && (
        <DeleteDialog
          {...DeleteDialogProps}
          title="Delete variable"
          itemName={variableToDelete.name}
        />
      )}
    </Card>
  )
}
