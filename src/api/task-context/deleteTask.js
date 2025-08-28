import { useMutation } from '@tanstack/react-query'

const deleteTask = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deleteTask`, {
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

export const useDeleteTask = (options = {}) => {
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      console.log('Task(s) deleted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting task(s):', error)
      options.onError?.(error)
    },
  })
}

/**
 * Deletes one or more tasks after validating ownership and returns deletion confirmation.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "task_ids": ["5d3e2f36-8db3-49c2-93e6-96bf9f632d66", "6e4f3g47-9ac4-50d3-04f7-07cg0g743e77"]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "task_ids": ["5d3e2f36-8db3-49c2-93e6-96bf9f632d66", "6e4f3g47-9ac4-50d3-04f7-07cg0g743e77"],
 *     "count": 2
 *   },
 *   "message": "2 task(s) deleted successfully",
 *   "timestamp": "2025-07-06T22:24:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Tasks not found or you don't have permission to delete them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */