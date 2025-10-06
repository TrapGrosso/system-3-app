import * as React from "react"
import { useState } from "react"
import { Plus, ClipboardList, Calendar, CheckSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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

import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"
import EditableListItem from "@/components/shared/ui/EditableListItem"

import { useTasks, useProspectTasks } from "@/contexts/TaskContext"
import { formatAbsolute } from '@/utils/timeformat'

const TASK_FIELDS = [
  { name: "title", label: "Title", required: true, maxLength: 100 },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
  { name: "due_date", label: "Due date", type: "date" },
]

function ProspectTasksDialog({ 
  prospect_id,
  prospect_name = "this prospect",
  onSuccess,
  trigger,
  children,
  open = false,
  onOpenChange
}) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(null)
  
  // Get tasks context
  const {
    addTaskToProspect,
    updateTaskDetails,
    updateTaskStatus,
    deleteTasks,
    isCreatingTask,
    isUpdatingTask,
    isDeletingTask,
    TASK_STATUS,
  } = useTasks()
  
  // Get prospect tasks
  const {
    data: prospectTasks = [],
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
    refetch: refetchTasks,
  } = useProspectTasks(prospect_id)

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return
    
    await addTaskToProspect(
      prospect_id, 
      newTaskTitle.trim(), 
      newTaskDescription.trim() || undefined,
      newTaskDueDate || undefined
    )
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskDueDate("")
    onSuccess?.()
  }

  const handleDeleteTask = async (taskId) => {
    deleteTasks([taskId])
    await onSuccess?.()
  }

  const handleStatusUpdate = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus)
    setStatusPopoverOpen(null)
    onSuccess?.()
  }

  const handleOpenChange = (newOpen) => {
    onOpenChange?.(newOpen)
    if (!newOpen) {
      // Reset all state
      setNewTaskTitle("")
      setNewTaskDescription("")
      setNewTaskDueDate("")
      setStatusPopoverOpen(null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleAddTask()
    }
  }


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

  // Sort tasks by creation date (newest first)
  const sortedTasks = [...prospectTasks].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  )

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleOpenChange}
      icon={<ClipboardList className="h-5 w-5" />}
      title={`Tasks for ${prospect_name}`}
      description="Add and manage tasks for this prospect. Use Ctrl+Enter to quickly save."
      size="lg"
    >
      {trigger && <DialogWrapper.Trigger>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger>{children}</DialogWrapper.Trigger>}
      
      <DialogWrapper.Body className="space-y-4">
        {/* Quick Add Task Section */}
        <div>
          <FormField
            id="new-task-title"
            label="Add new task"
            value={newTaskTitle}
            onChange={setNewTaskTitle}
            onKeyDown={handleKeyDown}
            disabled={isCreatingTask}
            required
            maxLength={100}
            placeholder="Task title..."
            autoFocus
          />
          <FormField
            id="new-task-description"
            label="Description"
            type="textarea"
            value={newTaskDescription}
            onChange={setNewTaskDescription}
            onKeyDown={handleKeyDown}
            disabled={isCreatingTask}
            rows={3}
            placeholder="Task description (optional)..."
          />
          <FormField
            id="new-task-due-date"
            label="Due date"
            type="date"
            value={newTaskDueDate}
            onChange={setNewTaskDueDate}
            disabled={isCreatingTask}
            placeholder="Pick a due date (optional)..."
          />
          <div className="flex justify-end mt-2">
            <SpinnerButton 
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              loading={isCreatingTask}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </SpinnerButton>
          </div>
        </div>

        <Separator />

        {/* Tasks List Section */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Tasks</h4>
            {!isLoadingTasks && (
              <Badge variant="secondary">
                {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3">
            {isLoadingTasks ? (
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
            ) : isErrorTasks ? (
              <div className="text-center py-8">
                <p className="text-sm text-destructive mb-2">Failed to load tasks</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchTasks()}
                >
                  Retry
                </Button>
              </div>
            ) : sortedTasks.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-2">No tasks yet</p>
                <p className="text-xs text-muted-foreground">
                  Add your first task above to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTasks.map((task) => (
                  <EditableListItem
                    key={task.id}
                    item={task}
                    fields={TASK_FIELDS}
                    mapInputToPayload={(draft) => ({
                      updated_title: draft.title.trim(),
                      updated_description: draft.description?.trim() || undefined,
                      updated_duedate: draft.due_date || undefined
                    })}
                    renderMeta={({ item }) => (
                      <div className="flex justify-between items-start flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground">
                            {formatAbsolute(item.created_at, { mode: "date", dateStyle: "short" })}
                          </span>
                          {item.due_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {formatAbsolute(item.due_date, { mode: "date", dateStyle: "short" })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    extraActions={({ item }) => (
                      <Popover 
                        open={statusPopoverOpen === item.id} 
                        onOpenChange={(open) => setStatusPopoverOpen(open ? item.id : null)}
                      >
                        <PopoverTrigger asChild>
                          <Badge 
                            variant={getStatusVariant(item.status)} 
                            className="cursor-pointer hover:opacity-80"
                          >
                            {getStatusLabel(item.status)}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-0" align="end">
                          <Command>
                            <CommandInput placeholder="Search status..." />
                            <CommandList>
                              <CommandEmpty>No status found.</CommandEmpty>
                              <CommandGroup>
                                {TASK_STATUS.map((status) => (
                                  <CommandItem
                                    key={status}
                                    value={status}
                                    onSelect={() => handleStatusUpdate(item.id, status)}
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
                    )}
                    renderView={({ item }) => (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}
                    onSave={async (payload) => {
                      await updateTaskDetails(task.id, payload)
                      onSuccess?.()
                    }}
                    onDelete={() => handleDeleteTask(task.id)}
                    loadingStates={{
                      save: isUpdatingTask,
                      delete: isDeletingTask
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
          loading={isCreatingTask || isUpdatingTask || isDeletingTask}
        >
          Close
        </SpinnerButton>
      </DialogWrapper.Footer>
    </DialogWrapper>
  )
}

export default ProspectTasksDialog
