import { useMutation } from '@tanstack/react-query'

const removeFromGroup = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/removeFromGroup`, {
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

export const useRemoveFromGroup = (options = {}) => {
  return useMutation({
    mutationFn: removeFromGroup,
    onSuccess: (data) => {
      console.log('Lead(s) successfully removed from group:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error removing lead(s) from group:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Removes prospects from a specific group.
 * 
 * Example Payload:
 * {"group_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7", "prospect_ids": ["alice", "bob"], "user_id": "1c8eb38e-7896-46e9-9a0c-d6af1bab11af"}
 * 
 * Example Success Response (200):
 * {"removed": 2, "not_found": 0, "message": "All prospects removed successfully", "timestamp": "2025-07-01T16:45:00.000Z"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid group_id. Must be a valid UUID string"}
 */