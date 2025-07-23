import * as React from "react"
import { useState } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SpinnerButton from "./SpinnerButton"
import FormField from "./FormField"

/**
 * EditableListItem - Flexible component for inline editing of list items
 * Supports both single-field (backward compatible) and multi-field editing
 * Handles view/edit modes, keyboard shortcuts, and loading states
 */
function EditableListItem({
  item,
  // Multi-field configuration
  fields, // Array of {name, type, label, required, ...formFieldProps}
  mapInputToPayload, // Function to transform draft object to API payload
  extraActions, // Function that returns additional action buttons
  loadingStates = {}, // {save: boolean, delete: boolean}
  
  // Legacy single-field props (for backward compatibility)
  renderView,
  renderMeta,
  renderEdit,
  onSave,
  onDelete,
  isLoading = false,
  isDeleting = false,
  editFieldProps = {},
  className,
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({})

  // Determine if we're in multi-field or legacy mode
  const isMultiField = Boolean(fields?.length)
  
  // Resolve loading states
  const saveLoading = loadingStates.save ?? isLoading
  const deleteLoading = loadingStates.delete ?? isDeleting

  const handleStartEdit = () => {
    setIsEditing(true)
    
    if (isMultiField) {
      // Multi-field mode: initialize draft with all field values
      const initialDraft = Object.fromEntries(
        fields.map(field => [
          field.name, 
          item[field.name] ?? ""
        ])
      )
      setDraft(initialDraft)
    } else {
      // Legacy mode: single field
      setDraft({ body: item.body || item.content || "" })
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setDraft({})
  }

  const handleSaveEdit = async () => {
    if (isMultiField) {
      // Validate required fields
      const requiredFields = fields.filter(f => f.required)
      const hasEmptyRequired = requiredFields.some(f => !draft[f.name]?.trim())
      if (hasEmptyRequired) return

      try {
        // Transform payload if mapper provided, otherwise use draft directly
        const payload = mapInputToPayload ? mapInputToPayload(draft) : draft
        await onSave?.(payload)
        setIsEditing(false)
        setDraft({})
      } catch (error) {
        console.error("Failed to save:", error)
      }
    } else {
      // Legacy mode: single field validation and save
      if (!draft.body?.trim()) return
      
      try {
        await onSave?.(draft.body.trim())
        setIsEditing(false)
        setDraft({})
      } catch (error) {
        console.error("Failed to save:", error)
      }
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete?.()
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSaveEdit()
    }
    if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const updateDraftField = (fieldName, value) => {
    setDraft(prev => ({ ...prev, [fieldName]: value }))
  }

  const canSave = isMultiField 
    ? fields.filter(f => f.required).every(f => draft[f.name]?.trim())
    : Boolean(draft.body?.trim())

  return (
    <div 
      className={`p-3 border rounded-md hover:bg-accent/50 transition-colors group ${className || ""}`}
      {...props}
    >
      {/* Meta information (timestamp, author, etc.) */}
      {renderMeta && (
        <div className="flex justify-between items-start mb-2">
          {renderMeta({ item })}
          
          {/* Action buttons - only show on hover when not editing */}
          {!isEditing && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Extra actions (status badges, etc.) */}
              {extraActions && extraActions({ item })}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleStartEdit}
                disabled={saveLoading}
              >
                <Edit3 className="h-3 w-3" />
                <span className="sr-only">Edit item</span>
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Delete item</span>
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content area */}
      {isEditing ? (
        <div className="space-y-2">
          {isMultiField ? (
            /* Multi-field edit mode */
            <div>
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  id={`${item.id || 'item'}-${field.name}`}
                  label={field.label}
                  type={field.type || 'text'}
                  value={draft[field.name] || ""}
                  onChange={(value) => updateDraftField(field.name, value)}
                  onKeyDown={field.type === 'date' ? undefined : handleKeyDown} // Skip keydown for date picker
                  disabled={saveLoading}
                  required={field.required}
                  {...field} // spread additional FormField props (maxLength, rows, etc.)
                />
              ))}
            </div>
          ) : (
            /* Legacy single-field edit mode */
            renderEdit ? (
              renderEdit({ item, value: draft.body || "", onChange: (val) => updateDraftField('body', val) })
            ) : (
              <Textarea
                value={draft.body || ""}
                onChange={(e) => updateDraftField('body', e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={saveLoading}
                className="min-h-[60px] resize-none"
                autoFocus
                {...editFieldProps}
              />
            )
          )}
          
          {/* Edit mode action buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={saveLoading}
            >
              Cancel
            </Button>
            <SpinnerButton
              size="sm"
              onClick={handleSaveEdit}
              disabled={!canSave}
              loading={saveLoading}
            >
              Save
            </SpinnerButton>
          </div>
        </div>
      ) : (
        /* View mode */
        renderView ? (
          renderView({ item })
        ) : isMultiField ? (
          /* Multi-field view mode - simple default rendering */
          <div className="space-y-2">
            {fields.map((field) => {
              const value = item[field.name]
              if (!value) return null
              
              return (
                <div key={field.name}>
                  {fields.length > 1 && (
                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                      {field.label}
                    </span>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {value}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          /* Legacy single-field view mode */
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {item.body || item.content || ""}
          </p>
        )
      )}
    </div>
  )
}

export default EditableListItem
