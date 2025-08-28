import { useMutation } from '@tanstack/react-query'

const addToGroup = async (payload) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/addToGroup`, {
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

export const useAddToGroup = (options = {}) => {
  return useMutation({
    mutationFn: addToGroup,
    onSuccess: (data) => {
      console.log('Leads successfully added to group:', data)
      options.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error adding leads to group:', error)
      options.onError?.(error)
    },
  })
}

/**
 * Adds prospects to a group with duplicate checking and permission validation.
 * 
 * Example Payload:
 * {"group_id": "a555dbda-15b9-41fb-96ed-1feb643f22e7", "prospect_ids": ["alice", "bob"], "user_id": "1c8eb38e-7896-46e9-9a0c-d6af1bab11af"}
 * 
 * Example Success Response (200):
 * {"added": 2, "duplicates": 0, "message": "All prospects added successfully", "timestamp": "2025-06-30T18:54:42.123Z"}
 * 
 * Example Error Response (400):
 * {"error": "Missing or invalid group_id. Must be a valid UUID string"}
 */