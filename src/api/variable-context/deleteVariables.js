import { useMutation } from '@tanstack/react-query'

const deleteVariables = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deleteVariables`, {
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

export const useDeleteVariables = (options = {}) => {
  return useMutation({
    mutationFn: deleteVariables,
    onSuccess: (data) => {
      console.log('Variable(s) deleted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting variable(s):', error)
      options.onError?.(error)
    },
  })
}


/**
 * Deletes multiple variables after validating ownership and returns deletion confirmation.
 * 
 * This function performs a bulk delete operation in a single SQL query, matching records
 * where user_id equals the provided user_id AND id is in the provided variable_ids array.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "variable_ids": [
 *     "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461"
 *   ]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "variable_ids": [
 *       "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *       "0c52c1f7-1b77-4d6f-9e0e-3e75baff7461"
 *     ],
 *     "count": 2
 *   },
 *   "message": "2 variable(s) deleted successfully",
 *   "timestamp": "2025-07-28T16:19:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Variables not found or you don't have permission to delete them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 * Example Error Response (400):
 * {"error": "All variable_ids must be valid UUIDs"}
 */
