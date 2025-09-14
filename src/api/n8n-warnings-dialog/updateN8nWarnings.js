import { useMutation } from '@tanstack/react-query'

const updateN8nWarnings = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/updateN8nWarnings`, {
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

export const useUpdateN8nWarnings = (options = {}) => {
  return useMutation({
    mutationFn: updateN8nWarnings,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error updating note:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Updates n8n execution warnings to mark them as seen.
 * 
 * Example Payload:
 * {
 *   "warning_ids": ["1", "2", "3"]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "updated_count": 3,
 *     "updated_ids": [1, 2, 3]
 *   },
 *   "message": "Marked warnings as seen",
 *   "timestamp": "2025-07-06T16:14:30.123Z"
 * }
 * 
 * Example Error Response (401):
 * {"error": "Unauthorized: Invalid or missing X-ADMIN-KEY header"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid warning_ids. Must be an array of strings"}
 * 
 * Example Error Response (400):
 * {"error": "Invalid warning ID format. All IDs must be numeric strings"}
 */
