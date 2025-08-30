import { useMutation } from '@tanstack/react-query'

const deletePrompt = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deletePrompt`, {
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

export const useDeletePrompt = (options = {}) => {
  return useMutation({
    mutationFn: deletePrompt,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting prompt:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Deletes a prompt after validating ownership and returns deletion confirmation.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "prompt_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "count": 1
 *   },
 *   "message": "Prompt deleted successfully",
 *   "timestamp": "2025-07-07T10:55:00.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Prompt not found or you don't have permission to delete it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid prompt_id format. Must be a valid UUID"}
 */