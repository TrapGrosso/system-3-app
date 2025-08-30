import { useMutation } from '@tanstack/react-query'

const emptyGroup = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emptyGroup`, {
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

export const useEmptyGroup = (options = {}) => {
  return useMutation({
    mutationFn: emptyGroup,
    onSuccess: (data) => {
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error empting group:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Empties a group by removing all prospects from it after validating ownership.
 * The group itself remains but all prospect_group associations are deleted.
 * 
 * Example Payload:
 * {
 *   "user_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7",
 *   "group_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66"
 * }
 * 
 * Example Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "emptied": true,
 *     "group_id": "5d3e2f36-8db3-49c2-93e6-96bf9f632d66",
 *     "deleted_count": 15
 *   },
 *   "message": "Group emptied successfully. 15 prospect(s) removed",
 *   "timestamp": "2025-07-10T11:29:23.456Z"
 * }
 * 
 * Example Error Response (404):
 * {"error": "Group not found or you don't have permission to empty it"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 * 
 */