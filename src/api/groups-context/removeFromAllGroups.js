import { useMutation } from '@tanstack/react-query'

const removeFromAllGroups = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/removeFromAllGroups`, {
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

export const useRemoveFromAllGroups = (options = {}) => {
  return useMutation({
    mutationFn: removeFromAllGroups,
    onSuccess: (data) => {
      console.log('Lead successfully removed from all groups:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error removing lead from all groups:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Removes a prospect from all groups associated with a user.
 * 
 * Example Payload:
 * {"user_id": "1c8eb38e-7896-46e9-9a0c-d6af1bab11af", "prospect_id": "alice"}
 * 
 * Example Success Response (200):
 * {"removed": 3, "not_found": 0, "message": "Prospect removed from 3 group(s)"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid user_id. Must be a valid UUID string"}
 */