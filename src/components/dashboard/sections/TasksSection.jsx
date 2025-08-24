import * as React from "react"
import { Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksTable } from "../components/tasks-section/TasksTable"

/**
 * TasksSection - Tasks overview with tabs for overdue, about to overdue, and completed
 */
export function TasksSection({ data, isLoading = false, onRefetch }) {
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
            onRefetch={onRefetch}
          />
        </TabsContent>

        <TabsContent value="about-to-overdue" className="space-y-4">
          <TasksTable 
            tasks={aboutToOverdue} 
            type="about-to-overdue"
            emptyMessage="No tasks due soon"
            onRefetch={onRefetch}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <TasksTable 
            tasks={recentlyCompleted} 
            type="completed"
            emptyMessage="No recently completed tasks"
            onRefetch={onRefetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
