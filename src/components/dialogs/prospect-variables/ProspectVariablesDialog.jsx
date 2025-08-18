import * as React from "react"
import { useState } from "react"
import { Plus, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import EditableListItem from "@/components/shared/ui/EditableListItem"
import VariableMetaBadges from "@/components/dialogs/prospect-variables/VariableMetaBadges"

import { useVariables, useProspectVariables } from "@/contexts/VariableContext"

const VARIABLE_FIELDS = [
  { name: "name", label: "Name", required: true, maxLength: 100 },
  { name: "value", label: "Value", required: true, type: "textarea", rows: 3 },
]

function ProspectVariablesDialog({ 
  prospect_id,
  prospect_name = "this prospect",
  onSuccess,
  trigger,
  children,
  open = false,
  onOpenChange
}) {
  const [newVariableName, setNewVariableName] = useState("")
  const [newVariableValue, setNewVariableValue] = useState("")
  
  // Get variables context
  const {
    addVariableToProspect,
    updateVariableDetails,
    deleteVariables,
    isCreatingVariable,
    isUpdatingVariable,
    isDeletingVariable,
  } = useVariables()
  
  // Get prospect variables
  const {
    data: prospectVariables = [],
    isLoading: isLoadingVariables,
    isError: isErrorVariables,
    refetch: refetchVariables,
  } = useProspectVariables(prospect_id)

  const handleAddVariable = async () => {
    if (!newVariableName.trim() || !newVariableValue.trim()) return
    
    await addVariableToProspect(
      prospect_id, 
      newVariableName.trim(), 
      newVariableValue.trim()
    )
    setNewVariableName("")
    setNewVariableValue("")
    onSuccess?.()
  }

  const handleDeleteVariable = async (variableId) => {
    await deleteVariables([variableId])
    onSuccess?.()
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange?.(newOpen)
    if (!newOpen) {
      // Reset all state
      setNewVariableName("")
      setNewVariableValue("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleAddVariable()
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Sort variables by creation date (newest first)
  const sortedVariables = [...prospectVariables].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  )

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Code2 className="h-5 w-5" />}
      title={`Variables for ${prospect_name}`}
      description="Add and manage variables for this prospect. Use Ctrl+Enter to quickly save."
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger>{children}</DialogWrapper.Trigger>}
      
      <DialogWrapper.Body className="space-y-4">
        {/* Quick Add Variable Section */}
        <div>
          <FormField
            id="new-variable-name"
            label="Add new variable"
            value={newVariableName}
            onChange={setNewVariableName}
            onKeyDown={handleKeyDown}
            disabled={isCreatingVariable}
            required
            maxLength={100}
            placeholder="Variable name..."
            autoFocus
          />
          <FormField
            id="new-variable-value"
            label="Value"
            type="textarea"
            value={newVariableValue}
            onChange={setNewVariableValue}
            onKeyDown={handleKeyDown}
            disabled={isCreatingVariable}
            required
            rows={3}
            placeholder="Variable value..."
          />
          <div className="flex justify-end mt-2">
            <SpinnerButton 
              onClick={handleAddVariable}
              disabled={!newVariableName.trim() || !newVariableValue.trim()}
              loading={isCreatingVariable}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Variable
            </SpinnerButton>
          </div>
        </div>

        <Separator />

        {/* Variables List Section */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Variables</h4>
            {!isLoadingVariables && (
              <Badge variant="secondary">
                {sortedVariables.length} variable{sortedVariables.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3">
            {isLoadingVariables ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 border rounded-md space-y-2">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : isErrorVariables ? (
              <div className="text-center py-8">
                <p className="text-sm text-destructive mb-2">Failed to load variables</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchVariables()}
                >
                  Retry
                </Button>
              </div>
            ) : sortedVariables.length === 0 ? (
              <div className="text-center py-8">
                <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-2">No variables yet</p>
                <p className="text-xs text-muted-foreground">
                  Add your first variable above to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedVariables.map((variable) => (
                  <EditableListItem
                    key={variable.id}
                    item={variable}
                    fields={VARIABLE_FIELDS}
                    mapInputToPayload={(draft) => ({
                      updated_name: draft.name.trim(),
                      updated_value: draft.value.trim()
                    })}
                    renderMeta={({ item }) => (
                      <div className="flex justify-between items-start flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.created_at)}
                          </span>
                          <VariableMetaBadges variable={item} formatDate={formatDate} />
                        </div>
                      </div>
                    )}
                    renderView={({ item }) => (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    )}
                    onSave={async (payload) => {
                      await updateVariableDetails(variable.id, payload)
                      onSuccess?.()
                    }}
                    onDelete={() => handleDeleteVariable(variable.id)}
                    loadingStates={{
                      save: isUpdatingVariable,
                      delete: isDeletingVariable
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogWrapper.Body>

      <DialogWrapper.Footer>
        <SpinnerButton 
          variant="outline" 
          onClick={() => handleOpenChange(false)}
          loading={isCreatingVariable || isUpdatingVariable || isDeletingVariable}
        >
          Close
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ProspectVariablesDialog
