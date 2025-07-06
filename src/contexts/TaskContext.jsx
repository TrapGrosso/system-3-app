import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetAllTasks } from "@/api/task-context/getAllTasks"
import { useGetAllProspectTasks } from "@/api/task-context/getAllProspectTasks"
import { useCreateTask } from "@/api/task-context/createTask"
import { useUpdateTask } from "@/api/task-context/updateTask"
import { useDeleteTask } from "@/api/task-context/deleteTask"
import { useAuth } from "./AuthContext"

// Task status enum
export const TASK_STATUS = ['open', 'in_progress', 'done', 'canceled', 'overdue']

const TaskContext = React.createContext(null)

export const TaskProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const user_id = user?.id

  // Create task mutation
  const createTaskMutation = useCreateTask({
    onSuccess: (data) => {
      const message = data.message || 'Task created successfully'
      toast.success(message)
      // Invalidate all tasks queries
      queryClient.invalidateQueries(['getAllTasks', user_id])
      // If tasks were created for specific prospects, invalidate those queries too
      if (data.data?.tasks) {
        data.data.tasks.forEach(task => {
          if (task.prospect_id) {
            queryClient.invalidateQueries(['getAllProspectTasks', user_id, task.prospect_id])
          }
        })
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task")
    },
  })

  // Update task mutation
  const updateTaskMutation = useUpdateTask({
    onSuccess: (data) => {
      const message = data.message || 'Task updated successfully'
      toast.success(message)
      // Invalidate all tasks queries
      queryClient.invalidateQueries(['getAllTasks', user_id])
      // If the task has a prospect_id, invalidate that specific prospect's tasks
      if (data.data?.task?.prospect_id) {
        queryClient.invalidateQueries(['getAllProspectTasks', user_id, data.data.task.prospect_id])
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task")
    },
  })

  // Delete task mutation
  const deleteTaskMutation = useDeleteTask({
    onSuccess: (data) => {
      const message = data.message || 'Task(s) deleted successfully'
      toast.success(message)
      // Invalidate all tasks queries
      queryClient.invalidateQueries(['getAllTasks', user_id])
      // Invalidate all prospect tasks queries since we don't know which prospects were affected
      queryClient.invalidateQueries(['getAllProspectTasks', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task(s)")
    },
  })

  // Helper functions
  const getProspectTasks = React.useCallback(
    (prospect_id) => {
      return queryClient.getQueryData(['getAllProspectTasks', user_id, prospect_id]) || []
    },
    [queryClient, user_id]
  )

  const invalidateProspectTasks = React.useCallback(
    (prospect_id) => {
      return queryClient.invalidateQueries(['getAllProspectTasks', user_id, prospect_id])
    },
    [queryClient, user_id]
  )

  const invalidateAllTasks = React.useCallback(
    () => {
      queryClient.invalidateQueries(['getAllTasks', user_id])
      queryClient.invalidateQueries(['getAllProspectTasks', user_id])
    },
    [queryClient, user_id]
  )

  const addTaskToProspect = React.useCallback(
    (prospect_id, task_title, task_description = '', task_duedate = null) => {
      return createTaskMutation.mutate({
        prospect_ids: [prospect_id],
        user_id,
        task_title,
        task_description,
        task_duedate
      })
    },
    [createTaskMutation, user_id]
  )

  const addGeneralTask = React.useCallback(
    (task_title, task_description = '', task_duedate = null) => {
      return createTaskMutation.mutate({
        user_id,
        task_title,
        task_description,
        task_duedate
      })
    },
    [createTaskMutation, user_id]
  )

  const updateTaskStatus = React.useCallback(
    (task_id, updated_status) => {
      // Validate status
      if (!TASK_STATUS.includes(updated_status)) {
        toast.error(`Invalid status. Must be one of: ${TASK_STATUS.join(', ')}`)
        return
      }
      return updateTaskMutation.mutate({
        user_id,
        task_id,
        updated_status
      })
    },
    [updateTaskMutation, user_id]
  )

  const updateTaskDetails = React.useCallback(
    (task_id, updates) => {
      // Validate status if provided
      if (updates.updated_status && !TASK_STATUS.includes(updates.updated_status)) {
        toast.error(`Invalid status. Must be one of: ${TASK_STATUS.join(', ')}`)
        return
      }
      return updateTaskMutation.mutate({
        user_id,
        task_id,
        ...updates
      })
    },
    [updateTaskMutation, user_id]
  )

  const deleteTasks = React.useCallback(
    (task_ids) => {
      return deleteTaskMutation.mutate({
        user_id,
        task_ids: Array.isArray(task_ids) ? task_ids : [task_ids]
      })
    },
    [deleteTaskMutation, user_id]
  )

  const value = React.useMemo(
    () => ({
      // User ID
      user_id,

      // Mutations
      createTask: createTaskMutation,
      updateTask: updateTaskMutation,
      deleteTask: deleteTaskMutation,

      // Helper functions
      getProspectTasks,
      invalidateProspectTasks,
      invalidateAllTasks,
      addTaskToProspect,
      addGeneralTask,
      updateTaskStatus,
      updateTaskDetails,
      deleteTasks,

      // Loading states
      isCreatingTask: createTaskMutation.isPending,
      isUpdatingTask: updateTaskMutation.isPending,
      isDeletingTask: deleteTaskMutation.isPending,

      // Task status enum
      TASK_STATUS,
    }),
    [
      user_id,
      createTaskMutation,
      updateTaskMutation,
      deleteTaskMutation,
      getProspectTasks,
      invalidateProspectTasks,
      invalidateAllTasks,
      addTaskToProspect,
      addGeneralTask,
      updateTaskStatus,
      updateTaskDetails,
      deleteTasks,
    ]
  )

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const context = React.useContext(TaskContext)
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}

// Hook for getting prospect-specific tasks with caching
export const useProspectTasks = (prospect_id) => {
  const { user_id } = useTasks()
  return useGetAllProspectTasks(user_id, prospect_id)
}

// Hook for getting all user tasks
export const useAllTasks = () => {
  const { user_id } = useTasks()
  return useGetAllTasks(user_id)
}
