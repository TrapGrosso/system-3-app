import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGetAllTasksQuery } from "@/api/task-context/getAllTasks"
import { useQueryErrorFallback } from "@/utils/useQueryErrorFallback"
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
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
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
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
      if (data.data?.task?.id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', user_id, { taskId: data.data.task.id }] })
      }
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
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
      // Invalidate all prospect tasks queries since we don't know which prospects were affected
      queryClient.invalidateQueries(['getAllProspectTasks', user_id])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task(s)")
    },
  })

  // Query params kept in context
  const [query, setQueryState] = React.useState({
    page: 1,
    page_size: 10,
    sort_by: 'created_at',
    sort_dir: 'desc',
    title: '',
    description: '',
    status: '',
    due_date_from: '',
    due_date_to: '',
    ended_at_from: '',
    ended_at_to: '',
  })

  // Use the tasks query hook
  const queryApi = useGetAllTasksQuery({ userId: user_id, ...query })

  const resetFilters = React.useCallback(() => {
    setQueryState(prev => ({
      ...prev,
      title: '',
      description: '',
      status: '',
      due_date_from: '',
      due_date_to: '',
      ended_at_from: '',
      ended_at_to: '',
      page: 1,
    }))
  }, [])

  const { resetFallback } = useQueryErrorFallback(queryApi, resetFilters, 'tasks', {
    resetOnlyIfFiltersActive: true,
    query,
    activeFilterOptions: {
      defaults: { sort_by: 'created_at', sort_dir: 'desc' }
    }
  })

  const userSetQuery = React.useCallback((partialOrUpdater) => {
    resetFallback()
    if (typeof partialOrUpdater === 'function') {
      setQueryState(prev => partialOrUpdater(prev))
    } else {
      setQueryState(prev => ({ ...prev, ...partialOrUpdater }))
    }
  }, [resetFallback])

  // Helper functions (prospect tasks)
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
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
      queryClient.invalidateQueries(['getAllProspectTasks', user_id])
    },
    [queryClient, user_id]
  )

  const addTaskToProspect = React.useCallback(
    (prospect_id, task_title, task_description = '', task_duedate = null) => {
      return createTaskMutation.mutateAsync({
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
      return createTaskMutation.mutateAsync({
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
      return updateTaskMutation.mutateAsync({
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
      return updateTaskMutation.mutateAsync({
        user_id,
        task_id,
        ...updates
      })
    },
    [updateTaskMutation, user_id]
  )

  const deleteTasks = React.useCallback(
    (task_ids) => {
      return deleteTaskMutation.mutateAsync({
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
      useTask, // Expose the new useTask hook

      // Query data/states
      data: queryApi.data?.data || queryApi.data || [],
      total: queryApi.data?.total || 0,
      isLoading: queryApi.isLoading,
      isFetching: queryApi.isFetching,
      isError: queryApi.isError,
      error: queryApi.error,
      refetch: queryApi.refetch,

      // Query controls
      query,
      setQuery: (partial) => userSetQuery(partial),
      updateQuery: (fn) => userSetQuery(fn),
      resetFilters,

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
      useTask,
      queryApi,
      query,
      userSetQuery,
      resetFilters
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

// Hook for getting all user tasks (prefer context)
export const useAllTasks = () => {
  return useTasks()
}

// Hook for getting a specific task by ID
export const useTask = (task_id) => {
  const { user_id } = useTasks()
  const { data, ...rest } = useGetAllTasksQuery({ userId: user_id, taskId: task_id })

  return {
    data: Array.isArray(data) ? data[0] : data,
    ...rest
  }
}
