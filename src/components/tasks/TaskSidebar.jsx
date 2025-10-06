import * as React from "react"
import { Edit3, Trash2, Save, X, Calendar, CheckSquare, ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { useTasks } from "@/contexts/TaskContext"
import { useDialogs } from "@/contexts/DialogsContext"
import { formatAbsolute } from "@/utils/timeformat"

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'secondary'
    case 'in_progress':
      return 'default'
    case 'done':
      return 'outline'
    case 'canceled':
      return 'destructive'
    case 'overdue':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    case 'overdue':
      return 'Overdue'
    default:
      return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
  }
}

function TaskSidebar({ task, onTaskChange, className }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingTitle, setEditingTitle] = React.useState("")
  const [editingDescription, setEditingDescription] = React.useState("")
  const [editingDueDate, setEditingDueDate] = React.useState("")
  const [statusPopoverOpen, setStatusPopoverOpen] = React.useState(false)

  const {
    updateTaskDetails,
    updateTaskStatus,
    deleteTasks,
    isUpdatingTask,
    isDeletingTask,
    TASK_STATUS,
  } = useTasks()

  const { confirm } = useDialogs()

  // Check if task has ended
  const isEnded = React.useMemo(() => Boolean(task?.ended_at), [task])
  const canModify = !isEnded

  // Update editing fields when task changes
  React.useEffect(() => {
    if (task) {
      setEditingTitle(task.title || "")
      setEditingDescription(task.description || "")
      setEditingDueDate(task.due_date || "")
    }
  }, [task])

  // Cancel editing if task becomes ended while editing
  React.useEffect(() => {
    if (isEditing && isEnded) {
      setIsEditing(false)
    }
  }, [isEnded, isEditing])

  const handleStartEdit = () => {
    if (!task) return
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (!task) return
    setIsEditing(false)
    // Reset to original values
    setEditingTitle(task.title || "")
    setEditingDescription(task.description || "")
    setEditingDueDate(task.due_date || "")
  }

  const handleSaveEdit = () => {
    if (!task || !editingTitle.trim()) return

    updateTaskDetails(task.id, {
      updated_title: editingTitle.trim(),
      updated_description: editingDescription.trim() || undefined,
      updated_duedate: editingDueDate || undefined
    })
    setIsEditing(false)
    onTaskChange?.(null)
  }

  const handleStatusUpdate = (newStatus) => {
    if (!task) return
    updateTaskStatus(task.id, newStatus)
    setStatusPopoverOpen(false)
    onTaskChange?.(null)
  }

  const handleDelete = async () => {
    if (!task) return
    const confirmed = await confirm({
      title: "Delete task?",
      description: `This will permanently delete "${task.title}".`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    })
    if (confirmed) {
      deleteTasks([task.id])
      onTaskChange?.(null) // Clear selection after delete
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

  // No task selected
  if (!task) {
    return (
      <div className={`border rounded-lg p-6 ${className}`}>
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Task Selected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a task from the table to view and edit its details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <CheckSquare className="h-5 w-5 text-muted-foreground shrink-0" />
            <h3 className="font-medium truncate">Task Details</h3>
          </div>
          <div className="flex gap-1">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartEdit}
                  disabled={!canModify || isUpdatingTask || isDeletingTask}
                  aria-disabled={!canModify}
                  className={canModify ? "" : "opacity-50 cursor-not-allowed"}
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="sr-only">Edit task</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={!canModify || isDeletingTask || isUpdatingTask}
                  aria-disabled={!canModify}
                  className={canModify ? "" : "opacity-50 cursor-not-allowed"}
                >
                  {isDeletingTask ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete task</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isUpdatingTask}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!canModify || !editingTitle.trim() || isUpdatingTask}
                  aria-disabled={!canModify}
                  className={canModify ? "" : "opacity-50 cursor-not-allowed"}
                >
                  {isUpdatingTask ? (
                    <Spinner size="sm" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className="sr-only">Save changes</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <div>
            {canModify ? (
              <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                <PopoverTrigger asChild>
                  <Badge 
                    variant={getStatusVariant(task.status)} 
                    className="cursor-pointer hover:opacity-80"
                  >
                    {getStatusLabel(task.status)}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {TASK_STATUS.map((status) => (
                          <CommandItem
                            key={status}
                            value={status}
                            onSelect={() => handleStatusUpdate(status)}
                            className="cursor-pointer"
                          >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            {getStatusLabel(status)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <Badge 
                variant={getStatusVariant(task.status)} 
                className="opacity-80 cursor-not-allowed"
                aria-disabled="true"
              >
                {getStatusLabel(task.status)}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="sidebar-title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          {isEditing ? (
            <Input
              id="sidebar-title"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isUpdatingTask}
              placeholder="Task title..."
              maxLength={200}
            />
          ) : (
            <p className="text-sm font-medium">{task.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="sidebar-description" className="text-sm font-medium">
            Description
          </Label>
          {isEditing ? (
            <Textarea
              id="sidebar-description"
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isUpdatingTask}
              className="min-h-[80px] resize-none"
              placeholder="Task description..."
              maxLength={1000}
            />
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {task.description || 'No description'}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="sidebar-due-date" className="text-sm font-medium">
            Due Date
          </Label>
          {isEditing ? (
            <Input
              id="sidebar-due-date"
              type="date"
              value={editingDueDate}
              onChange={(e) => setEditingDueDate(e.target.value)}
              disabled={isUpdatingTask}
              min={new Date().toISOString().split('T')[0]}
            />
          ) : (
            <div>
              {task.due_date ? (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatAbsolute(task.due_date, { mode: "date", dateStyle: "short" })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No due date set</p>
              )}
            </div>
          )}
        </div>

        {/* Ended callout strip */}
        {isEnded && (
          <div className="flex gap-2 rounded-md border bg-muted/40 p-3">
            <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-sm">
              This task ended on {formatAbsolute(task.ended_at, { mode: "date", dateStyle: "short" })}. Editing and deletion are locked.
            </span>
          </div>
        )}

        <Separator />

        {/* Metadata */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Created</Label>
          <p className="text-sm text-muted-foreground">
            {formatAbsolute(task.created_at, { mode: "date", dateStyle: "short" })}
          </p>
        </div>

        {/* Action Buttons (when editing) */}
        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isUpdatingTask}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editingTitle.trim() || isUpdatingTask}
              className="flex-1"
            >
              {isUpdatingTask && <Spinner size="sm" className="mr-2" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskSidebar
