import * as React from "react"
import { User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/table/DataTable"
import { formatRelativeTime } from "@/components/shared/ui/ChartKit"
import { useDialogs } from "@/contexts/DialogsContext"
import { useTasks } from "@/contexts/TaskContext"

/**
 * TasksTable - Reusable table component for different task types
 */
export function TasksTable({ tasks, type, emptyMessage, onRefetch }) {
  const columns = [
    {
      accessorKey: "title",
      header: "Task",
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="space-y-1">
            <div className="font-medium">{task.title}</div>
            {task.description && (
              <div className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => {
        const task = row.original
        const dueDate = task.due_date
        
        if (!dueDate) return "-"
        
        const date = new Date(dueDate)
        const now = new Date()
        const isOverdue = date < now && type !== "completed"
        
        return (
          <div className="space-y-1">
            <div className={`text-sm ${isOverdue ? "text-destructive font-medium" : ""}`}>
              {date.toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatRelativeTime(dueDate)}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const task = row.original
        const status = task.status || "pending"
        
        const getStatusVariant = (status) => {
          switch (status.toLowerCase()) {
            case "completed":
              return "default"
            case "overdue":
              return "destructive"
            case "in_progress":
              return "outline"
            default:
              return "secondary"
          }
        }
        
        return (
          <Badge variant={getStatusVariant(status)}>
            {status.replace("_", " ")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "prospect",
      header: "Prospect",
      cell: ({ row }) => {
        const task = row.original
        const prospect = task.prospect
        
        if (!prospect) return "-"
        
        return (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {prospect.name || "Unknown"}
              </div>
              {prospect.linkedin_id && (
                <div className="text-xs text-muted-foreground">
                  @{prospect.linkedin_id}
                </div>
              )}
            </div>
          </div>
        )
      },
    }
  ]

  const { openUpdateTask, confirm } = useDialogs()
  const { deleteTasks } = useTasks()

  const handleUpdate = async (task) => {
    try {
      const result = await openUpdateTask({ taskId: task.id, task })
      // If the dialog reported success (dialogsRegistry resolves true on success), refresh
      if (result) {
        onRefetch?.()
      }
    } catch (e) {
      // No-op; Update dialog handles its own errors/toasts
    }
  }

  const handleDelete = async (task) => {
    try {
      const ok = await confirm({
        title: "Delete task?",
        description: `Delete "${task.title}"? This cannot be undone.`,
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
      })
      if (!ok) return
      await deleteTasks(task.id)
      onRefetch?.()
    } catch (e) {
      // deleteTasks toasts errors; nothing else to do
    }
  }

  const rowActions = (task) => {
    if (type !== "about-to-overdue") {
      return []
    }
    return [
      {
        label: "Update",
        onSelect: () => handleUpdate(task),
      },
      {
        label: "Delete",
        onSelect: () => handleDelete(task),
      },
    ]
  }

  const rowClassName = (task) => {
    if (type === "overdue") {
      return "bg-destructive/5 border-destructive/20"
    }
    if (type === "about-to-overdue") {
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800/30"
    }
    return ""
  }

  return (
    <DataTable
      columns={columns}
      data={tasks}
      enableSelection={false}
      rowActions={type === "about-to-overdue" ? rowActions : undefined}
      rowClassName={rowClassName}
      emptyMessage={emptyMessage}
      rowId={(row) => row.id}
    />
  )
}