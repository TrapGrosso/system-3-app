import * as React from "react"
import { Plus } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"

import { useTasks } from "@/contexts/TaskContext"

function TaskFormDialog({ children, ...props }) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [dueDate, setDueDate] = React.useState("")

  const {
    addGeneralTask,
    isCreatingTask,
  } = useTasks()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) return

    await addGeneralTask(
      title.trim(),
      description.trim() || undefined,
      dueDate || undefined
    )

    // Reset form and close dialog on success
    setTitle("")
    setDescription("")
    setDueDate("")
    setOpen(false)
  }

  const handleOpenChange = (newOpen) => {
    if (!newOpen && !isCreatingTask) {
      // Reset form when closing
      setTitle("")
      setDescription("")
      setDueDate("")
    }
    setOpen(newOpen)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const isValid = title.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to your personal task list. Use Ctrl+Enter to quickly save.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreatingTask}
              maxLength={200}
              autoFocus
              required
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {title.length}/200 characters
              </span>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="task-description"
              placeholder="Enter task description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreatingTask}
              className="min-h-[80px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {description.length}/1000 characters
              </span>
            </div>
          </div>

          {/* Due Date Field */}
          <div className="space-y-2">
            <Label htmlFor="task-due-date" className="text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isCreatingTask}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreatingTask}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isCreatingTask}
            >
              {isCreatingTask && <Spinner size="sm" className="mr-2" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskFormDialog
