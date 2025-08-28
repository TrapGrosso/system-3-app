import { useMutation } from '@tanstack/react-query'

const deleteProspects = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deleteProspects`, {
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

export const useDeleteProspects = (options = {}) => {
  return useMutation({
    mutationFn: deleteProspects,
    onSuccess: (data) => {
      console.log('Prospect(s) deleted successfully:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error deleting prospect(s):', error)
      options.onError?.(error)
    },
  })
}

/**
 * Deletes one or more prospects after validating ownership and returns deletion confirmation.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "prospect_ids": ["abc123", "def456"]
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "deleted": true,
 *     "prospect_ids": ["abc123", "def456"],
 *     "count": 2
 *   },
 *   "message": "2 prospect(s) deleted successfully",
 *   "timestamp": "2025-07-06T22:24:45.123Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Prospects not found or you don't have permission to delete them"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */
