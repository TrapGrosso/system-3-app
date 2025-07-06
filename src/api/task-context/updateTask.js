import { useMutation } from '@tanstack/react-query'

const updateTask = async (payload) => {
  const response = await fetch('https://mbojaegemegtbpvlwjwt.supabase.co/functions/v1/updateTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}

export const useUpdateTask = (options = {}) => {
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      console.log('Task updated successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating task:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Updates a task's properties after validating ownership and returns the updated task.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "task_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_title": "Updated task title",
 *   "updated_description": "Updated task description with new details",
 *   "updated_status": "in_progress",
 *   "updated_duedate": "2025-12-31"
 * }
 * 
 * Partial Update Example:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "task_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *   "updated_status": "done"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "task": {
 *       "id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *       "prospect_id": "john-doe-123",
 *       "title": "Updated task title",
 *       "description": "Updated task description with new details",
 *       "due_date": "2025-12-31",
 *       "status": "in_progress",
 *       "created_at": "2025-07-04T20:29:15.123456"
 *     }
 *   },
 *   "message": "Task updated successfully",
 *   "timestamp": "2025-07-06T16:14:30.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Task not found or you don't have permission to update it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid updated_status. Must be one of: open, in_progress, done, canceled, overdue"}
 */