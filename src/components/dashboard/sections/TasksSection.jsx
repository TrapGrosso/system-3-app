import * as React from "react"
import { Clock, CheckCircle, AlertTriangle, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/shared/table/DataTable"
import { formatRelativeTime } from "@/components/shared/ui/ChartKit"

/**
 * TasksSection - Tasks overview with tabs for overdue, about to overdue, and completed
 */
export function TasksSection({ data, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted/30 animate-pulse rounded w-48" />
        <div className="space-y-4">
          <div className="h-10 bg-muted/30 animate-pulse rounded" />
          <div className="h-64 bg-muted/30 animate-pulse rounded" />
        </div>
      </div>
    )
  }

  const tasks = data?.tasks || {}
  const overdue = tasks.overdue || []
  const aboutToOverdue = tasks.aboutToOverdue || []
  const recentlyCompleted = tasks.recentlyCompleted || []

  // Calculate default tab based on priority
  const getDefaultTab = () => {
    if (overdue.length > 0) return "overdue"
    if (aboutToOverdue.length > 0) return "about-to-overdue"
    return "completed"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex items-center gap-2">
          {overdue.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {overdue.length} overdue
            </Badge>
          )}
          {aboutToOverdue.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {aboutToOverdue.length} due soon
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue={getDefaultTab()} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overdue" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Overdue ({overdue.length})
          </TabsTrigger>
          <TabsTrigger value="about-to-overdue" className="gap-2">
            <Clock className="h-4 w-4" />
            Due Soon ({aboutToOverdue.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Recently Completed ({recentlyCompleted.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="space-y-4">
          <TasksTable 
            tasks={overdue} 
            type="overdue"
            emptyMessage="No overdue tasks"
          />
        </TabsContent>

        <TabsContent value="about-to-overdue" className="space-y-4">
          <TasksTable 
            tasks={aboutToOverdue} 
            type="about-to-overdue"
            emptyMessage="No tasks due soon"
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <TasksTable 
            tasks={recentlyCompleted} 
            type="completed"
            emptyMessage="No recently completed tasks"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * TasksTable - Reusable table component for different task types
 */
function TasksTable({ tasks, type, emptyMessage }) {
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
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const task = row.original
        const priority = task.priority || "medium"
        
        const getPriorityVariant = (priority) => {
          switch (priority.toLowerCase()) {
            case "high":
              return "destructive"
            case "medium":
              return "outline"
            case "low":
              return "secondary"
            default:
              return "outline"
          }
        }
        
        return (
          <Badge variant={getPriorityVariant(priority)} className="capitalize">
            {priority}
          </Badge>
        )
      },
    },
  ]

  const rowActions = (task) => [
    {
      label: "View Details",
      onSelect: () => {
        // Navigate to task details or open ProspectTasksDialog
        console.log("Open task:", task.id)
      },
    },
    ...(type !== "completed" ? [
      {
        label: "Mark Complete",
        onSelect: () => {
          // Mark task as completed
          console.log("Complete task:", task.id)
        },
      }
    ] : []),
  ]

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
      rowActions={rowActions}
      rowClassName={rowClassName}
      emptyMessage={emptyMessage}
      rowId={(row) => row.id}
    />
  )
}
