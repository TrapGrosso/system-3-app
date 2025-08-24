import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Edit3, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import DialogWrapper from "@/components/shared/dialog/DialogWrapper"
import SpinnerButton from "@/components/shared/ui/SpinnerButton"
import FormField from "@/components/shared/ui/FormField"

import { useTasks, useTask as useTaskHook } from "@/contexts/TaskContext"

// Utility: Status label mapping
const getStatusLabel = (status) => {
  switch (status) {
    case "in_progress":
      return "In Progress"
    case "overdue":
      return "Overdue"
    case "done":
      return "Done"
    case "canceled":
      return "Canceled"
    case "open":
      return "Open"
    default:
      return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"
  }
}

// A small wrapper component to safely use the useTask hook only when a taskId exists
function TaskFetcher({ taskId, children }) {
  const result = useTaskHook(taskId)
  return children(result)
}

function UpdateTaskForm({
  open,
  onOpenChange,
  task,
  isLoading,
  isError,
  refetch,
  onSuccess,
}) {
  const { TASK_STATUS, updateTaskDetails, isUpdatingTask } = useTasks()

  // Local submitting state (in addition to mutation pending)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prepare form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
  })

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date || "",
        status: task.status || "",
      })
    }
  }, [task])

  // Reset transient state on close
  useEffect(() => {
    if (!open) {
      setIsSubmitting(false)
    }
  }, [open])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Prevent updates when done/overdue (treat legacy "completed" as done)
  const normalizedStatus = (task?.status || "").toLowerCase()
  const isBlocked =
    normalizedStatus === "done" ||
    normalizedStatus === "overdue" ||
    normalizedStatus === "completed"

  const statusOptions = useMemo(
    () => TASK_STATUS.map((s) => ({ value: s, label: getStatusLabel(s) })),
    [TASK_STATUS]
  )

  const isFormValid = formData.title.trim().length > 0 && !!task?.id
  const isBusy = isSubmitting || isUpdatingTask

  const handleClose = () => {
    onOpenChange?.(false)
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.()

    if (!task?.id || isBlocked) return
    if (!formData.title.trim()) return

    // Build diff payload against original task
    const updates = {}

    if (formData.title.trim() !== (task.title || "")) {
      updates.updated_title = formData.title.trim()
    }

    if ((formData.description || "").trim() !== (task.description || "")) {
      // Allow clearing to empty -> send undefined to avoid hard empty string if desired
      const trimmed = formData.description.trim()
      updates.updated_description = trimmed || undefined
    }

    const currentDue = task.due_date || ""
    const newDue = formData.due_date || ""
    if (newDue !== currentDue) {
      updates.updated_duedate = newDue || undefined
    }

    if ((formData.status || "") !== (task.status || "")) {
      updates.updated_status = formData.status || undefined
    }

    // No changes -> just close
    if (Object.keys(updates).length === 0) {
      handleClose()
      return
    }

    try {
      setIsSubmitting(true)
      await updateTaskDetails(task.id, updates)
      handleClose()
      onSuccess?.()
    } catch (err) {
      // Error toast handled in context; keep dialog open for user to adjust
      console.error("Failed to update task:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
        <DialogWrapper.Footer>
          <Button variant="outline" disabled>
            Close
          </Button>
          <SpinnerButton loading disabled>
            Update Task
          </SpinnerButton>
        </DialogWrapper.Footer>
      </>
    )
  }

  // Error state
  if (isError) {
    return (
      <>
        <div className="text-center py-8 space-y-3">
          <AlertTriangle className="h-10 w-10 mx-auto text-destructive" />
          <p className="text-sm text-destructive">Failed to load task</p>
          {typeof refetch === "function" && (
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          )}
        </div>
        <DialogWrapper.Footer>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogWrapper.Footer>
      </>
    )
  }

  return (
    <>
      {isBlocked && (
        <div className="mb-2">
          <Badge variant="destructive">
            This task is {getStatusLabel(task?.status)} and cannot be edited.
          </Badge>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <FormField
          id="task-title"
          label="Title"
          required
          value={formData.title}
          onChange={(v) => handleInputChange("title", v)}
          placeholder="Enter task title..."
          maxLength={100}
          helper="Task name"
          disabled={isBusy || isBlocked}
        />

        {/* Description */}
        <FormField
          id="task-description"
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(v) => handleInputChange("description", v)}
          placeholder="Enter task description..."
          rows={3}
          helper="Optional"
          disabled={isBusy || isBlocked}
        />

        {/* Due date */}
        <FormField
          id="task-due-date"
          label="Due date"
          type="date"
          value={formData.due_date}
          onChange={(v) => handleInputChange("due_date", v)}
          placeholder="Pick a due date"
          disabled={isBusy || isBlocked}
        />

        {/* Status */}
        <FormField
          id="task-status"
          label="Status"
          type="select"
          value={formData.status}
          onChange={(v) => handleInputChange("status", v)}
          placeholder="Select status..."
          options={statusOptions}
          helper="Current status of the task"
          disabled={isBusy || isBlocked}
        />
      </form>

      <DialogWrapper.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={handleClose} disabled={isBusy}>
          Cancel
        </Button>
        <SpinnerButton loading={isBusy} disabled={!isFormValid || isBlocked} onClick={handleSubmit}>
          Update Task
        </SpinnerButton>
      </DialogWrapper.Footer>
    </>
  )
}

function UpdateTaskDialog({
  open,
  onOpenChange,
  taskId, // preferred over task when both provided
  task, // optional pre-fetched task object
  onSuccess,
  trigger,
  children,
}) {
  // Decide source of task data:
  // - If taskId is provided, fetch via useTask hook.
  // - Else, display the provided task object.
  // - If both are provided, taskId takes precedence.

  const header = (
    <>
      {trigger && <DialogWrapper.Trigger asChild>{trigger}</DialogWrapper.Trigger>}
      {children && <DialogWrapper.Trigger asChild>{children}</DialogWrapper.Trigger>}
    </>
  )

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      icon={<Edit3 className="h-5 w-5" />}
      title="Edit Task"
      description="Update the task details."
      size="lg"
    >
      {header}

      <DialogWrapper.Body className="space-y-4">
        {taskId ? (
          <TaskFetcher taskId={taskId}>
            {({ data, isLoading, isError, refetch }) => (
              <UpdateTaskForm
                open={open}
                onOpenChange={onOpenChange}
                task={data}
                isLoading={isLoading}
                isError={isError}
                refetch={refetch}
                onSuccess={onSuccess}
              />
            )}
          </TaskFetcher>
        ) : (
          <UpdateTaskForm
            open={open}
            onOpenChange={onOpenChange}
            task={task}
            isLoading={false}
            isError={!task}
            refetch={undefined}
            onSuccess={onSuccess}
          />
        )}
      </DialogWrapper.Body>
    </DialogWrapper>
  )
}

export default UpdateTaskDialog
