import * as React from "react"
import { useState } from "react"
import { Edit3, Trash2, Plus, ClipboardList, Calendar, CheckSquare } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

import { useTasks, useProspectTasks } from "@/contexts/TaskContext"

function ProspectTasksDialog({ 
  prospect_id,
  prospect_name = "this prospect",
  onSuccess,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingDescription, setEditingDescription] = useState("")
  const [editingDueDate, setEditingDueDate] = useState("")
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
  
  // Determine if this is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined
  const dialogOpen = isControlled ? controlledOpen : internalOpen
  const setDialogOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    
    addTaskToProspect(
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

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id)
    setEditingTitle(task.title || "")
    setEditingDescription(task.description || "")
    setEditingDueDate(task.due_date || "")
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setEditingTitle("")
    setEditingDescription("")
    setEditingDueDate("")
  }

  const handleSaveEdit = () => {
    if (!editingTitle.trim() || !editingTaskId) return
    
    updateTaskDetails(editingTaskId, {
      updated_title: editingTitle.trim(),
      updated_description: editingDescription.trim() || undefined,
      updated_duedate: editingDueDate || undefined
    })
    setEditingTaskId(null)
    setEditingTitle("")
    setEditingDescription("")
    setEditingDueDate("")
    onSuccess?.()
  }

  const handleDeleteTask = (taskId) => {
    deleteTasks([taskId])
    onSuccess?.()
  }

  const handleStatusUpdate = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus)
    setStatusPopoverOpen(null)
    onSuccess?.()
  }

  const handleOpenChange = (newOpen) => {
    if (setDialogOpen) {
      setDialogOpen(newOpen)
    }
    if (!newOpen) {
      // Reset all state
      setNewTaskTitle("")
      setNewTaskDescription("")
      setNewTaskDueDate("")
      setEditingTaskId(null)
      setEditingTitle("")
      setEditingDescription("")
      setEditingDueDate("")
      setStatusPopoverOpen(null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (editingTaskId) {
        handleSaveEdit()
      } else {
        handleAddTask()
      }
    }
    if (e.key === 'Escape') {
      if (editingTaskId) {
        handleCancelEdit()
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
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
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Tasks for {prospect_name}
          </DialogTitle>
          <DialogDescription>
            Add and manage tasks for this prospect. Use Ctrl+Enter to quickly save.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Quick Add Task Section */}
          <div className="space-y-3">
            <Label htmlFor="new-task-title" className="text-sm font-medium">
              Add new task
            </Label>
            <div className="space-y-3">
              <Input
                id="new-task-title"
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isCreatingTask}
                autoFocus
              />
              <Textarea
                placeholder="Task description (optional)..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isCreatingTask}
                className="min-h-[60px] resize-none"
              />
              <Input
                type="date"
                placeholder="Due date (optional)..."
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                disabled={isCreatingTask}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newTaskTitle.length}/100 characters
              </span>
              <Button 
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim() || isCreatingTask}
                size="sm"
              >
                {isCreatingTask && <Spinner size="sm" className="mr-2" />}
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tasks List Section */}
          <div className="flex-1 overflow-hidden flex flex-col">
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
                    <div key={task.id} className="p-3 border rounded-md hover:bg-accent/50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(task.created_at)}
                          </span>
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {formatDate(task.due_date)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {/* Status Popover */}
                          <Popover 
                            open={statusPopoverOpen === task.id} 
                            onOpenChange={(open) => setStatusPopoverOpen(open ? task.id : null)}
                          >
                            <PopoverTrigger asChild>
                              <Badge 
                                variant={getStatusVariant(task.status)} 
                                className="cursor-pointer hover:opacity-80"
                              >
                                {getStatusLabel(task.status)}
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
                                        onSelect={() => handleStatusUpdate(task.id, status)}
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
                          
                          {/* Action buttons */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleStartEdit(task)}
                              disabled={editingTaskId === task.id || isUpdatingTask}
                            >
                              <Edit3 className="h-3 w-3" />
                              <span className="sr-only">Edit task</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteTask(task.id)}
                              disabled={isDeletingTask}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Delete task</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {editingTaskId === task.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isUpdatingTask}
                            placeholder="Task title..."
                            autoFocus
                          />
                          <Textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isUpdatingTask}
                            className="min-h-[60px] resize-none"
                            placeholder="Task description..."
                          />
                          <Input
                            type="date"
                            value={editingDueDate}
                            onChange={(e) => setEditingDueDate(e.target.value)}
                            disabled={isUpdatingTask}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={isUpdatingTask}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={!editingTitle.trim() || isUpdatingTask}
                            >
                              {isUpdatingTask && <Spinner size="sm" className="mr-2" />}
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isCreatingTask || isUpdatingTask || isDeletingTask}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProspectTasksDialog
