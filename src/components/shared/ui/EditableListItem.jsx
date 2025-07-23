import * as React from "react"
import { useState } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SpinnerButton from "./SpinnerButton"

/**
 * EditableListItem - Reusable component for inline editing of list items
 * Handles view/edit modes, keyboard shortcuts, and loading states
 */
function EditableListItem({
  item,
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
  const [editValue, setEditValue] = useState("")

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditValue(renderEdit ? "" : item.body || item.content || "")
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditValue("")
  }

  const handleSaveEdit = async () => {
    if (!editValue.trim()) return
    
    try {
      await onSave?.(editValue.trim())
      setIsEditing(false)
      setEditValue("")
    } catch (error) {
      // Handle error - could emit to parent or show toast
      console.error("Failed to save:", error)
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
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleStartEdit}
                disabled={isLoading}
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
                  disabled={isDeleting}
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
          {/* Custom edit render or default textarea */}
          {renderEdit ? (
            renderEdit({ item, value: editValue, onChange: setEditValue })
          ) : (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="min-h-[60px] resize-none"
              autoFocus
              {...editFieldProps}
            />
          )}
          
          {/* Edit mode action buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <SpinnerButton
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editValue.trim()}
              loading={isLoading}
            >
              Save
            </SpinnerButton>
          </div>
        </div>
      ) : (
        // View mode
        renderView ? (
          renderView({ item })
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {item.body || item.content || ""}
          </p>
        )
      )}
    </div>
  )
}

export default EditableListItem
